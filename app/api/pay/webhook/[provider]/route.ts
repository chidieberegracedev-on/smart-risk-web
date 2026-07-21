import { NextRequest, NextResponse } from "next/server";
import {
  sbSelect,
  sbInsert,
  sbUpdate,
  supabaseConfigured,
  UniqueViolationError,
} from "@/lib/supabase-admin";
import { getAdapter, getProvider } from "@/lib/payments";
import type { PaymentSession } from "@/lib/payments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/pay/webhook/[provider]
// The ONLY writer of ad_payments. Order is strict:
//   signature verify (raw body) → parse → load session → verify the money →
//   insert ad_payments (DB trigger activates the campaign) → mark session.
// This route NEVER sets a campaign to 'active' itself.
export async function POST(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const adapter = getAdapter(params.provider);
    if (!adapter) {
      return NextResponse.json({ error: "unknown_provider" }, { status: 404 });
    }
    const provider = await getProvider(params.provider);
    if (!provider) {
      return NextResponse.json({ error: "unknown_provider" }, { status: 404 });
    }

    // 1. Signature over the RAW body — reject anything unverified.
    const rawBody = await req.text();
    if (!adapter.verifyWebhook(rawBody, req.headers, provider)) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }

    // 2. Parse + find our session reference.
    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "bad_payload" }, { status: 400 });
    }
    const event = adapter.parseEvent(payload);
    if (!event?.reference) {
      // Not an event we track (e.g. unrelated event type) — acknowledge.
      return NextResponse.json({ received: true });
    }

    const sessions = await sbSelect<PaymentSession>(
      "payment_sessions",
      `id=eq.${encodeURIComponent(event.reference)}&select=*&limit=1`
    );
    const session = sessions[0];
    if (!session) {
      // Unknown reference: acknowledge so the provider stops retrying, but do
      // nothing — there is nothing safe to activate.
      console.warn(`webhook ${adapter.id}: unknown reference ${event.reference}`);
      return NextResponse.json({ received: true });
    }

    // 3. Verify the money. Success + amount ≥ expected + same currency.
    const amountOk =
      event.success &&
      event.amount != null &&
      event.amount >= session.amount &&
      (event.currency ?? "").toUpperCase() === session.currency.toUpperCase();

    if (!amountOk) {
      console.warn(
        `webhook ${adapter.id}: verification failed for session ${session.id}`,
        { success: event.success, amount: event.amount, currency: event.currency,
          expected: { amount: session.amount, currency: session.currency } }
      );
      await sbUpdate(
        "payment_sessions",
        `id=eq.${encodeURIComponent(session.id)}`,
        { status: "failed" }
      );
      // Acknowledge — don't activate, don't invite retries.
      return NextResponse.json({ received: true });
    }

    // 4. Insert the verified payment. The DB trigger flips the campaign to
    //    active. A duplicate (provider, provider_reference) means a replay —
    //    treat as already processed.
    try {
      await sbInsert("ad_payments", {
        status: "succeeded",
        verified_at: new Date().toISOString(),
        verified_via: "webhook",
        provider: provider.id,
        provider_reference: event.providerReference ?? session.id,
        amount: session.amount,
        currency: session.currency,
        campaign_id: session.campaign_id,
        advertiser_uid: session.advertiser_uid,
      });
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw err;
    }

    // 5. Close out our session.
    await sbUpdate(
      "payment_sessions",
      `id=eq.${encodeURIComponent(session.id)}`,
      {
        status: "completed",
        provider_reference: event.providerReference ?? null,
      }
    );

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`webhook ${params.provider} error:`, err);
    // 500 → providers retry, which is what we want for transient failures.
    return NextResponse.json({ error: "webhook_error" }, { status: 500 });
  }
}
