import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/verify-firebase-token";
import { sbSelect, supabaseConfigured } from "@/lib/supabase-admin";
import type { CampaignListItem } from "@/lib/portal/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/portal/campaigns — the caller's campaigns for the table view.
// Token verified first; filtered by the VERIFIED uid only.
interface Row extends Omit<CampaignListItem, "price_amount" | "price_currency"> {
  price_amount?: number | null;
  price_currency?: number | null;
  quoted_price?: number | null;
  quoted_currency?: string | null;
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

    const rows = await sbSelect<Row>(
      "ad_campaigns",
      `advertiser_uid=eq.${uid}&select=id,name,status,target_audience,duration_days,impressions,reach,clicks,price_amount,price_currency,quoted_price,quoted_currency,created_at&order=created_at.desc&limit=200`
    );

    const campaigns: CampaignListItem[] = rows.map((r) => ({
      id: r.id,
      name: r.name ?? "Untitled campaign",
      status: r.status,
      target_audience: r.target_audience ?? null,
      duration_days: r.duration_days ?? null,
      impressions: r.impressions ?? 0,
      reach: r.reach ?? 0,
      clicks: r.clicks ?? 0,
      price_amount: r.price_amount ?? r.quoted_price ?? null,
      price_currency:
        (r.price_currency as unknown as string) ?? r.quoted_currency ?? null,
      created_at: r.created_at ?? null,
    }));

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("portal campaigns error:", err);
    return NextResponse.json({ error: "campaigns_failed" }, { status: 500 });
  }
}
