import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { verifyFirebaseToken } from "@/lib/verify-firebase-token";
import { sbInsert, supabaseConfigured } from "@/lib/supabase-admin";
import { getEligibleAudience, quoteCampaignPrice } from "@/lib/portal/rpc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/portal/campaigns/create — submit a promotion for review.
// Clients may only create draft / pending_review (the DB guard enforces this);
// we always insert pending_review. Crucially, the price is RE-QUOTED
// server-side from the submitted config — the client's displayed price is
// never trusted or stored. advertiser_uid is the VERIFIED uid.
export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const verified = await verifyFirebaseToken(token);
    if (!verified) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const b = (await req.json().catch(() => null)) as {
      name?: string;
      goal?: string;
      targetAudience?: string | null;
      targetInterests?: string[];
      audienceSize?: number;
      durationDays?: number;
      headline?: string;
      body?: string;
      destinationUrl?: string;
      mediaUrl?: string | null;
      ctaType?: string;
      ctaLabel?: string;
    } | null;
    if (!b) return NextResponse.json({ error: "bad_request" }, { status: 400 });

    // Minimal validation of required contract fields.
    const name = (b.name ?? "").trim();
    const goal = b.goal ?? "views";
    const durationDays = Number(b.durationDays) || 0;
    if (!name || durationDays <= 0) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const targetAudience = b.targetAudience ?? null;
    const targetInterests = Array.isArray(b.targetInterests) ? b.targetInterests : [];

    // Re-quote authoritatively — the stored price is the server's, not the client's.
    const audience = await getEligibleAudience({ targetAudience, targetInterests });
    const audienceSize = Math.min(
      Math.max(0, Number(b.audienceSize) || 0),
      audience.eligible
    );
    const quote = await quoteCampaignPrice({
      targetAudience,
      targetInterests,
      audienceSize,
      durationDays,
      goal,
    });
    if (quote.price == null || !quote.currency) {
      return NextResponse.json({ error: "quote_unavailable" }, { status: 502 });
    }

    const id = randomUUID();
    await sbInsert("ad_campaigns", {
      id,
      advertiser_uid: verified.uid,
      status: "pending_review",
      name,
      goal,
      target_audience: targetAudience,
      target_interests: targetInterests,
      target_audience_size: audienceSize,
      max_impressions: quote.maxImpressions,
      frequency_cap: quote.frequencyCap,
      quoted_price: quote.price,
      quoted_currency: quote.currency,
      duration_days: durationDays,
      headline: b.headline ?? null,
      body: b.body ?? null,
      destination_url: b.destinationUrl ?? null,
      media_url: b.mediaUrl ?? null,
      cta_type: b.ctaType ?? null,
      cta_label: b.ctaLabel ?? null,
    });

    return NextResponse.json({ id, status: "pending_review" });
  } catch (err) {
    console.error("portal create error:", err);
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }
}
