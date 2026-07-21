// Shared types for the provider-adapter payment layer.
// Secret keys live in the payment_providers table (service-role only) and are
// used exclusively server-side — nothing in this module may reach the client.

export type ProviderId = "paystack" | "flutterwave" | "stripe";

export interface ProviderRow {
  id: ProviderId;
  is_active: boolean;
  public_key: string | null;
  secret_key: string;
  webhook_secret: string | null;
  config: Record<string, unknown> | null;
}

export interface Campaign {
  id: string;
  name?: string | null;
  status: string;
  advertiser_uid: string;
  price_amount?: number | null;
  price_currency?: string | null;
  quoted_price?: number | null;
  quoted_currency?: string | null;
  advertiser_email?: string | null;
  contact_email?: string | null;
  audience?: string | null;
  duration_days?: number | null;
  max_impressions?: number | null;
  [key: string]: unknown;
}

export interface PaymentSession {
  id: string;
  campaign_id: string;
  advertiser_uid: string;
  amount: number; // major units (e.g. 25.00), the source of truth for checks
  currency: string;
  status: "created" | "completed" | "failed";
  provider_reference?: string | null;
}

export interface CreateCheckoutArgs {
  session: PaymentSession;
  campaign: Campaign;
  provider: ProviderRow;
  /** Absolute URL the provider sends the browser back to after payment. */
  returnUrl: string;
  /** Customer email for the provider checkout. */
  email: string;
}

/** Normalized webhook event after parsing a provider payload. */
export interface ParsedEvent {
  /** Provider reports the payment as successful. */
  success: boolean;
  /** OUR reference (payment_sessions.id) echoed back by the provider. */
  reference: string | null;
  /** The provider's own transaction id (for ad_payments.provider_reference). */
  providerReference: string | null;
  /** Amount in MAJOR units, normalized from the provider's representation. */
  amount: number | null;
  currency: string | null;
}

export interface PaymentAdapter {
  id: ProviderId;
  /** Create a provider checkout and return the redirect URL. */
  createCheckout(args: CreateCheckoutArgs): Promise<string>;
  /** Verify a webhook's authenticity from the RAW body + headers. */
  verifyWebhook(rawBody: string, headers: Headers, provider: ProviderRow): boolean;
  /** Parse a (verified) webhook payload into a normalized event. */
  parseEvent(payload: unknown): ParsedEvent | null;
}

/** Currencies whose smallest unit is the major unit (no ×100). */
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "UGX", "RWF", "XOF", "XAF"]);

/** Convert major units to the integer subunit amount providers expect. */
export function toSubunit(amount: number, currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

/** Convert a provider subunit amount back to major units. */
export function fromSubunit(amount: number, currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? amount : amount / 100;
}
