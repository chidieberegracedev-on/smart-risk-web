import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/verify-firebase-token";
import { sbSelect, supabaseConfigured } from "@/lib/supabase-admin";
import type { CampaignDetail } from "@/lib/portal/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/portal/campaigns/[id] — one campaign, ONLY if it belongs to the
// verified caller. The uid is added to the query filter so another user's id
// simply returns nothing (404), never someone else's data.
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const id = encodeURIComponent(params.id);

    const rows = await sbSelect<Record<string, unknown>>(
      "ad_campaigns",
      `id=eq.${id}&advertiser_uid=eq.${uid}&select=*&limit=1`
    );
    const r = rows[0];
    if (!r) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const n = (v: unknown) => (typeof v === "number" ? v : null);
    const detail: CampaignDetail = {
      id: String(r.id),
      name: (r.name as string) ?? "Untitled campaign",
      status: String(r.status),
      target_audience: (r.target_audience as string) ?? null,
      duration_days: n(r.duration_days),
      impressions: n(r.impressions) ?? 0,
      reach: n(r.reach) ?? 0,
      clicks: n(r.clicks) ?? 0,
      price_amount: n(r.price_amount) ?? n(r.quoted_price),
      price_currency:
        (r.price_currency as string) ?? (r.quoted_currency as string) ?? null,
      created_at: (r.created_at as string) ?? null,
      goal: (r.goal as string) ?? null,
      target_interests: (r.target_interests as string[]) ?? null,
      max_impressions: n(r.max_impressions),
      frequency_cap: n(r.frequency_cap),
      website_visits: n(r.website_visits),
      profile_visits: n(r.profile_visits),
      review_note: (r.review_note as string) ?? null,
      reviewed_at: (r.reviewed_at as string) ?? null,
      paid_at: (r.paid_at as string) ?? null,
      activated_at: (r.activated_at as string) ?? null,
      headline: (r.headline as string) ?? null,
      body: (r.body as string) ?? null,
      media_url: (r.media_url as string) ?? null,
      destination_url: (r.destination_url as string) ?? null,
      cta_type: (r.cta_type as string) ?? null,
      cta_label: (r.cta_label as string) ?? null,
    };

    return NextResponse.json({ campaign: detail });
  } catch (err) {
    console.error("portal campaign detail error:", err);
    return NextResponse.json({ error: "detail_failed" }, { status: 500 });
  }
}
