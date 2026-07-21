import { NextRequest, NextResponse } from "next/server";
import { sbSelect, supabaseConfigured } from "@/lib/supabase-admin";
import type { Campaign, PaymentSession } from "@/lib/payments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/pay/status?session=<id> → { sessionStatus, campaignStatus }
// Read-only: lets the result page poll while the webhook lands. Exposes only
// two status strings — no amounts, no keys, no rows.
export async function GET(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    const id = req.nextUrl.searchParams.get("session");
    if (!id) {
      return NextResponse.json({ error: "missing_session" }, { status: 400 });
    }

    const sessions = await sbSelect<PaymentSession>(
      "payment_sessions",
      `id=eq.${encodeURIComponent(id)}&select=id,status,campaign_id&limit=1`
    );
    const session = sessions[0];
    if (!session) {
      return NextResponse.json({ error: "session_not_found" }, { status: 404 });
    }

    const campaigns = await sbSelect<Campaign>(
      "ad_campaigns",
      `id=eq.${encodeURIComponent(session.campaign_id)}&select=id,status&limit=1`
    );

    return NextResponse.json({
      sessionStatus: session.status,
      campaignStatus: campaigns[0]?.status ?? null,
      campaignId: session.campaign_id,
    });
  } catch (err) {
    console.error("status error:", err);
    return NextResponse.json({ error: "status_failed" }, { status: 500 });
  }
}
