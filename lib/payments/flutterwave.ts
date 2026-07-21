import { timingSafeEqual } from "crypto";
import { type PaymentAdapter, type ParsedEvent } from "./types";

// Flutterwave adapter.
// Checkout: POST /v3/payments with our session id as `tx_ref`; amounts are in
// MAJOR units already. Webhook: the verif-hash header must equal the stored
// webhook secret.

export const flutterwave: PaymentAdapter = {
  id: "flutterwave",

  async createCheckout({ session, campaign, provider, returnUrl, email }) {
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.secret_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: session.id,
        amount: session.amount,
        currency: session.currency,
        redirect_url: returnUrl,
        customer: { email },
        customizations: {
          title: "Smart Risk Assistant",
          description: campaign.name
            ? `Campaign: ${campaign.name}`
            : "Advertising campaign",
        },
      }),
    });
    const json = (await res.json()) as {
      status?: string;
      data?: { link?: string };
      message?: string;
    };
    const url = json?.data?.link;
    if (!res.ok || json?.status !== "success" || !url) {
      throw new Error(`flutterwave payments failed: ${json?.message ?? res.status}`);
    }
    return url;
  },

  verifyWebhook(_rawBody, headers, provider) {
    const hash = headers.get("verif-hash");
    const secret = provider.webhook_secret;
    if (!hash || !secret) return false;
    const a = Buffer.from(hash);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
  },

  parseEvent(payload): ParsedEvent | null {
    const p = payload as {
      event?: string;
      data?: {
        tx_ref?: string;
        id?: number | string;
        amount?: number;
        currency?: string;
        status?: string;
      };
    };
    if (!p?.data) return null;
    return {
      success:
        (p.event === "charge.completed" || p.event === "charge.success") &&
        p.data.status === "successful",
      reference: p.data.tx_ref ?? null,
      providerReference: p.data.id != null ? String(p.data.id) : null,
      amount: p.data.amount ?? null, // already major units
      currency: p.data.currency ?? null,
    };
  },
};
