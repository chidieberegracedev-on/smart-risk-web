import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sbSelect, sbInsert, sbUpdate, supabaseConfigured } from "@/lib/supabase-admin";
import { getAdapter, getActiveProvider } from "@/lib/payments";
import type { Campaign, PaymentSession } from "@/lib/payments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYABLE_STATUSES = ["approved_payment_required", "payment_processing"];

// POST { campaignId } → { url }
// The amount ALWAYS comes from the campaign row server-side — the client never
// sends or computes money.
export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
    }

    const body = (await req.json().catch(() => null)) as { campaignId?: string } | null;
    const campaignId = body?.campaignId;
    if (!campaignId || typeof campaignId !== "string") {
      return NextResponse.json({ error: "missing_campaign" }, { status: 400 });
    }

    // 1. Load the campaign and require a payable status + a priced amount.
    const campaigns = await sbSelect<Campaign>(
      "ad_campaigns",
      `id=eq.${encodeURIComponent(campaignId)}&select=*&limit=1`
    );
    const campaign = campaigns[0];
    if (!campaign) {
      return NextResponse.json({ error: "campaign_not_found" }, { status: 404 });
    }
    if (!PAYABLE_STATUSES.includes(campaign.status)) {
      return NextResponse.json({ error: "campaign_not_payable" }, { status: 400 });
    }
    const amount = campaign.price_amount ?? campaign.quoted_price;
    const currency = campaign.price_currency ?? campaign.quoted_currency;
    if (amount == null || !currency || amount <= 0) {
      return NextResponse.json({ error: "campaign_unpriced" }, { status: 400 });
    }

    // 2. Active provider (secrets never leave the server).
    const provider = await getActiveProvider();
    const adapter = provider ? getAdapter(provider.id) : null;
    if (!provider || !adapter) {
      return NextResponse.json({ error: "no_active_provider" }, { status: 503 });
    }

    // 3. Our checkout reference.
    const session: PaymentSession = {
      id: randomUUID(),
      campaign_id: campaign.id,
      advertiser_uid: campaign.advertiser_uid,
      amount,
      currency,
      status: "created",
    };
    await sbInsert("payment_sessions", { ...session });

    // 4. Provider checkout URL.
    const origin =
      req.headers.get("origin") ??
      `https://${req.headers.get("x-forwarded-host") ?? req.headers.get("host")}`;
    const returnUrl = `${origin}/pay/result?session=${session.id}`;
    const email =
      campaign.advertiser_email ??
      campaign.contact_email ??
      "billing@smartriskassistant.com";

    const url = await adapter.createCheckout({
      session,
      campaign,
      provider,
      returnUrl,
      email,
    });

    // 5. Mark the campaign as in-flight.
    await sbUpdate("ad_campaigns", `id=eq.${encodeURIComponent(campaign.id)}`, {
      status: "payment_processing",
    });

    // 6. Browser redirects here.
    return NextResponse.json({ url });
  } catch (err) {
    console.error("checkout error:", err);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
