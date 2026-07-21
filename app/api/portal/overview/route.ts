import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/verify-firebase-token";
import { sbSelect, supabaseConfigured } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/portal/overview — everything the Overview needs, in one call.
// The Firebase ID token is verified FIRST; every query below is filtered by
// the VERIFIED uid, never anything from the request.

interface CampaignRow {
  id: string;
  name?: string | null;
  status: string;
  impressions?: number | null;
  reach?: number | null;
  clicks?: number | null;
  website_visits?: number | null;
  created_at?: string | null;
}

export async function GET(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const verified = await verifyFirebaseToken(token);
    if (!verified) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const uid = encodeURIComponent(verified.uid);

    const [profiles, applications, campaigns, payments] = await Promise.all([
      sbSelect<{
        display_name?: string | null;
        email?: string | null;
        display_currency?: string | null;
      }>(
        "profiles",
        `firebase_uid=eq.${uid}&select=display_name,email,display_currency&limit=1`
      ).catch(() => []),
      sbSelect<{
        status?: string | null;
        type?: string | null;
        category?: string | null;
        tier?: number | null;
        review_note?: string | null;
      }>(
        "advertiser_applications",
        `advertiser_uid=eq.${uid}&select=status,type,category,tier,review_note&order=created_at.desc&limit=1`
      ).catch(() => []),
      sbSelect<CampaignRow>(
        "ad_campaigns",
        `advertiser_uid=eq.${uid}&select=id,name,status,impressions,reach,clicks,website_visits,created_at&order=created_at.desc&limit=50`
      ).catch(() => []),
      sbSelect<{ amount?: number | null; currency?: string | null }>(
        "ad_payments",
        `advertiser_uid=eq.${uid}&status=eq.succeeded&select=amount,currency`
      ).catch(() => []),
    ]);

    // Real sums from real rows — nothing invented.
    const totals = {
      activeCampaigns: campaigns.filter((c) => c.status === "active").length,
      impressions: campaigns.reduce((n, c) => n + (c.impressions ?? 0), 0),
      reach: campaigns.reduce((n, c) => n + (c.reach ?? 0), 0),
      clicks: campaigns.reduce((n, c) => n + (c.clicks ?? 0), 0),
      websiteVisits: campaigns.reduce((n, c) => n + (c.website_visits ?? 0), 0),
      // Spend grouped per currency — no cross-currency pretending.
      spent: Object.entries(
        payments.reduce<Record<string, number>>((acc, p) => {
          if (p.amount != null && p.currency) {
            acc[p.currency] = (acc[p.currency] ?? 0) + p.amount;
          }
          return acc;
        }, {})
      ).map(([currency, amount]) => ({ currency, amount })),
    };

    const attention = campaigns
      .filter((c) =>
        ["approved_payment_required", "pending_review", "needs_info"].includes(
          c.status
        )
      )
      .slice(0, 6)
      .map((c) => ({ id: c.id, name: c.name ?? "Untitled campaign", status: c.status }));

    return NextResponse.json({
      profile: profiles[0] ?? null,
      application: applications[0] ?? null,
      totals,
      attention,
      recent: campaigns.slice(0, 6).map((c) => ({
        id: c.id,
        name: c.name ?? "Untitled campaign",
        status: c.status,
        impressions: c.impressions ?? 0,
        created_at: c.created_at ?? null,
      })),
    });
  } catch (err) {
    console.error("portal overview error:", err);
    return NextResponse.json({ error: "overview_failed" }, { status: 500 });
  }
}
