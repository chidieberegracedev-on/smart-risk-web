import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/verify-firebase-token";
import { supabaseConfigured } from "@/lib/supabase-admin";
import { getEligibleAudience, quoteCampaignPrice } from "@/lib/portal/rpc";
import type { QuoteResult } from "@/lib/portal/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/portal/quote — the backend is the source of truth for both the
// eligible-audience max and the price. The client never computes price.
// Token verified first (privileged: uses the service key via the RPCs).
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

    const body = (await req.json().catch(() => null)) as {
      targetAudience?: string | null;
      targetInterests?: string[];
      audienceSize?: number;
      durationDays?: number;
      goal?: string;
    } | null;
    if (!body) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    const targetAudience = body.targetAudience ?? null;
    const targetInterests = Array.isArray(body.targetInterests)
      ? body.targetInterests
      : [];
    const durationDays = Number(body.durationDays) || 0;
    const goal = body.goal ?? "views";

    const audience = await getEligibleAudience({ targetAudience, targetInterests });
    // Clamp the requested audience to the real eligible max.
    const audienceSize = Math.min(
      Math.max(0, Number(body.audienceSize) || 0),
      audience.eligible
    );

    const quote = await quoteCampaignPrice({
      targetAudience,
      targetInterests,
      audienceSize,
      durationDays,
      goal,
    });

    const result: QuoteResult = {
      eligibleAudience: audience.eligible,
      maxImpressions: quote.maxImpressions,
      frequencyCap: quote.frequencyCap,
      price: quote.price,
      currency: quote.currency,
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error("portal quote error:", err);
    // Honest failure — the UI must NOT fabricate a price when this fails.
    return NextResponse.json({ error: "quote_failed" }, { status: 502 });
  }
}
