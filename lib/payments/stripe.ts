import { createHmac, timingSafeEqual } from "crypto";
import {
  type PaymentAdapter,
  type ParsedEvent,
  toSubunit,
  fromSubunit,
} from "./types";

// Stripe adapter — implemented against the REST API with fetch (no SDK).
// Checkout: create a Checkout Session (mode=payment) with our session id as
// client_reference_id. Webhook: verify the stripe-signature header manually —
// HMAC-SHA256 of "<t>.<rawBody>" with the webhook secret must match a v1 sig,
// with a 5-minute timestamp tolerance (same scheme as constructEvent).

const TOLERANCE_SECONDS = 5 * 60;

function form(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export const stripe: PaymentAdapter = {
  id: "stripe",

  async createCheckout({ session, campaign, provider, returnUrl, email }) {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.secret_key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form({
        mode: "payment",
        client_reference_id: session.id,
        customer_email: email,
        "line_items[0][price_data][currency]": session.currency.toLowerCase(),
        "line_items[0][price_data][unit_amount]": String(
          toSubunit(session.amount, session.currency)
        ),
        "line_items[0][price_data][product_data][name]": campaign.name
          ? `Campaign: ${campaign.name}`
          : "Advertising campaign",
        "line_items[0][quantity]": "1",
        success_url: returnUrl,
        cancel_url: returnUrl,
      }),
    });
    const json = (await res.json()) as {
      url?: string;
      error?: { message?: string };
    };
    if (!res.ok || !json?.url) {
      throw new Error(`stripe checkout failed: ${json?.error?.message ?? res.status}`);
    }
    return json.url;
  },

  verifyWebhook(rawBody, headers, provider) {
    const header = headers.get("stripe-signature");
    const secret = provider.webhook_secret;
    if (!header || !secret) return false;

    const parts = new Map<string, string[]>();
    for (const kv of header.split(",")) {
      const [k, v] = kv.split("=", 2);
      if (!k || v === undefined) continue;
      const key = k.trim();
      parts.set(key, [...(parts.get(key) ?? []), v]);
    }
    const t = parts.get("t")?.[0];
    const sigs = parts.get("v1") ?? [];
    if (!t || sigs.length === 0) return false;

    const age = Math.abs(Date.now() / 1000 - Number(t));
    if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

    const expected = createHmac("sha256", secret)
      .update(`${t}.${rawBody}`)
      .digest("hex");
    const a = Buffer.from(expected);
    return sigs.some((sig) => {
      const b = Buffer.from(sig);
      return a.length === b.length && timingSafeEqual(a, b);
    });
  },

  parseEvent(payload): ParsedEvent | null {
    const p = payload as {
      type?: string;
      data?: {
        object?: {
          id?: string;
          client_reference_id?: string;
          amount_total?: number;
          currency?: string;
          payment_status?: string;
        };
      };
    };
    const obj = p?.data?.object;
    if (!obj) return null;
    const currency = obj.currency ? obj.currency.toUpperCase() : null;
    return {
      success:
        p.type === "checkout.session.completed" &&
        obj.payment_status === "paid",
      reference: obj.client_reference_id ?? null,
      providerReference: obj.id ?? null,
      amount:
        obj.amount_total != null && currency
          ? fromSubunit(obj.amount_total, currency)
          : null,
      currency,
    };
  },
};
