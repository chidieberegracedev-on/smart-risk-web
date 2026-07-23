import { sbRpc } from "@/lib/supabase-admin";

// Server-side wrappers for the pricing/audience RPCs. Price is ALWAYS the
// backend's word — never computed on the client.
//
// The exact RPC argument names live here so they can be corrected in ONE place
// if the deployed functions use different parameter names. Both wrappers parse
// results defensively (function may return a scalar, a single-row set, or an
// object) and return a normalized shape.

export interface EligibleAudience {
  eligible: number;
}

export interface PriceQuote {
  maxImpressions: number | null;
  frequencyCap: number | null;
  price: number | null;
  currency: string | null;
}

function pickNumber(obj: unknown, keys: string[]): number | null {
  const row = Array.isArray(obj) ? obj[0] : obj;
  if (row == null) return null;
  if (typeof row === "number") return row;
  for (const k of keys) {
    const v = (row as Record<string, unknown>)[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return null;
}

function pickString(obj: unknown, keys: string[]): string | null {
  const row = Array.isArray(obj) ? obj[0] : obj;
  if (row == null || typeof row !== "object") return null;
  for (const k of keys) {
    const v = (row as Record<string, unknown>)[k];
    if (typeof v === "string" && v) return v;
  }
  return null;
}

/** Max selectable audience for the given targeting. */
export async function getEligibleAudience(input: {
  targetAudience: string | null;
  targetInterests: string[];
}): Promise<EligibleAudience> {
  const raw = await sbRpc<unknown>("get_eligible_audience", {
    target_audience: input.targetAudience,
    target_interests: input.targetInterests,
  });
  return { eligible: pickNumber(raw, ["eligible", "count", "audience"]) ?? 0 };
}

/** Full price chain from the backend for the chosen configuration. */
export async function quoteCampaignPrice(input: {
  targetAudience: string | null;
  targetInterests: string[];
  audienceSize: number;
  durationDays: number;
  goal: string;
}): Promise<PriceQuote> {
  const raw = await sbRpc<unknown>("quote_campaign_price", {
    target_audience: input.targetAudience,
    target_interests: input.targetInterests,
    audience_size: input.audienceSize,
    duration_days: input.durationDays,
    goal: input.goal,
  });
  return {
    maxImpressions: pickNumber(raw, ["max_impressions", "maxImpressions", "impressions"]),
    frequencyCap: pickNumber(raw, ["frequency_cap", "frequencyCap"]),
    price: pickNumber(raw, ["price", "quoted_price", "amount", "price_amount"]),
    currency: pickString(raw, ["currency", "quoted_currency", "price_currency"]),
  };
}
