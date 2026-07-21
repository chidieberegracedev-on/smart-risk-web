import { createHmac, timingSafeEqual } from "crypto";
import {
  type PaymentAdapter,
  type ParsedEvent,
  toSubunit,
  fromSubunit,
} from "./types";

// Paystack adapter.
// Checkout: POST /transaction/initialize with our session id as `reference`.
// Webhook: HMAC-SHA512 of the RAW body with the secret key, compared to the
// x-paystack-signature header.

export const paystack: PaymentAdapter = {
  id: "paystack",

  async createCheckout({ session, provider, returnUrl, email }) {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.secret_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: toSubunit(session.amount, session.currency),
        currency: session.currency,
        reference: session.id,
        callback_url: returnUrl,
      }),
    });
    const json = (await res.json()) as {
      status?: boolean;
      data?: { authorization_url?: string };
      message?: string;
    };
    const url = json?.data?.authorization_url;
    if (!res.ok || !json?.status || !url) {
      throw new Error(`paystack initialize failed: ${json?.message ?? res.status}`);
    }
    return url;
  },

  verifyWebhook(rawBody, headers, provider) {
    const signature = headers.get("x-paystack-signature");
    if (!signature) return false;
    const computed = createHmac("sha512", provider.secret_key)
      .update(rawBody)
      .digest("hex");
    const a = Buffer.from(computed);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  },

  parseEvent(payload): ParsedEvent | null {
    const p = payload as {
      event?: string;
      data?: {
        reference?: string;
        id?: number | string;
        amount?: number;
        currency?: string;
        status?: string;
      };
    };
    if (!p?.data) return null;
    const currency = p.data.currency ?? null;
    return {
      success: p.event === "charge.success" && p.data.status === "success",
      reference: p.data.reference ?? null,
      providerReference: p.data.id != null ? String(p.data.id) : null,
      amount:
        p.data.amount != null && currency
          ? fromSubunit(p.data.amount, currency)
          : null,
      currency,
    };
  },
};
