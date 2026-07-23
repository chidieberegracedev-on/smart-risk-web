// Sample payload for PREVIEW MODE only (NEXT_PUBLIC_PORTAL_PREVIEW=1 while
// Firebase is not configured). Always shown with a visible "Preview mode —
// sample data" banner; never used when real auth is available.

import type {
  OverviewPayload,
  CampaignListItem,
  CampaignDetail,
  QuoteResult,
} from "./types";

export const demoOverview: OverviewPayload = {
  profile: {
    display_name: "Demo Advertiser",
    email: "preview@demo",
    display_currency: "NGN",
  },
  application: {
    status: "approved",
    type: "business",
    category: "Trading education",
    tier: 2,
    review_note: null,
  },
  totals: {
    activeCampaigns: 2,
    impressions: 128_400,
    reach: 41_260,
    clicks: 3_180,
    websiteVisits: 1_940,
    spent: [{ currency: "NGN", amount: 86_000 }],
  },
  attention: [
    {
      id: "demo-3",
      name: "October signals push",
      status: "approved_payment_required",
    },
    { id: "demo-4", name: "Webinar promo", status: "pending_review" },
  ],
  recent: [
    { id: "demo-1", name: "Risk course launch", status: "active", impressions: 84_200, created_at: "2026-07-02T09:00:00Z" },
    { id: "demo-2", name: "Community challenge", status: "active", impressions: 44_200, created_at: "2026-07-09T10:00:00Z" },
    { id: "demo-3", name: "October signals push", status: "approved_payment_required", impressions: 0, created_at: "2026-07-15T14:00:00Z" },
    { id: "demo-4", name: "Webinar promo", status: "pending_review", impressions: 0, created_at: "2026-07-19T08:00:00Z" },
    { id: "demo-5", name: "Spring brand test", status: "completed", impressions: 12_000, created_at: "2026-05-11T12:00:00Z" },
  ],
};

export const demoCampaigns: CampaignListItem[] = [
  { id: "demo-1", name: "Risk course launch", status: "active", target_audience: "Forex traders", duration_days: 14, impressions: 84_200, reach: 28_400, clicks: 2_140, price_amount: 45_000, price_currency: "NGN", created_at: "2026-07-02T09:00:00Z" },
  { id: "demo-2", name: "Community challenge", status: "active", target_audience: "Active MetaTrader users", duration_days: 7, impressions: 44_200, reach: 12_860, clicks: 1_040, price_amount: 21_000, price_currency: "NGN", created_at: "2026-07-09T10:00:00Z" },
  { id: "demo-3", name: "October signals push", status: "approved_payment_required", target_audience: "Signal followers", duration_days: 10, impressions: 0, reach: 0, clicks: 0, price_amount: 32_000, price_currency: "NGN", created_at: "2026-07-15T14:00:00Z" },
  { id: "demo-4", name: "Webinar promo", status: "pending_review", target_audience: "New traders", duration_days: 5, impressions: 0, reach: 0, clicks: 0, price_amount: 15_000, price_currency: "NGN", created_at: "2026-07-19T08:00:00Z" },
  { id: "demo-5", name: "Spring brand test", status: "completed", target_audience: "Forex traders", duration_days: 12, impressions: 12_000, reach: 8_100, clicks: 320, price_amount: 18_000, price_currency: "NGN", created_at: "2026-05-11T12:00:00Z" },
  { id: "demo-6", name: "Prop-firm offer", status: "rejected", target_audience: "Funded traders", duration_days: 14, impressions: 0, reach: 0, clicks: 0, price_amount: 40_000, price_currency: "NGN", created_at: "2026-06-20T12:00:00Z" },
];

export const demoCampaignDetail: Record<string, CampaignDetail> = {
  "demo-3": {
    ...demoCampaigns[2],
    goal: "website_visits",
    target_interests: ["risk management", "signals", "gold"],
    max_impressions: 120_000,
    frequency_cap: 3,
    website_visits: 0,
    profile_visits: 0,
    review_note: null,
    reviewed_at: "2026-07-16T09:00:00Z",
    paid_at: null,
    activated_at: null,
    headline: "Trade October's setups with a plan",
    body: "Join our October signals program — every call comes with a risk framework, not just an entry.",
    media_url: null,
    destination_url: "https://example.com/october",
    cta_type: "learn_more",
    cta_label: "Learn more",
  },
  "demo-6": {
    ...demoCampaigns[5],
    goal: "profile_visits",
    target_interests: ["prop firm", "funded"],
    max_impressions: 150_000,
    frequency_cap: 3,
    website_visits: 0,
    profile_visits: 0,
    review_note:
      "Please remove the '90% pass rate' claim — unverifiable performance figures aren't allowed. Resubmit and we'll review again.",
    reviewed_at: "2026-06-21T09:00:00Z",
    paid_at: null,
    activated_at: null,
    headline: "Get funded, keep your discipline",
    body: "A prop-firm challenge built around risk control.",
    media_url: null,
    destination_url: "https://example.com/prop",
    cta_type: "visit",
    cta_label: "Visit site",
  },
  "demo-1": {
    ...demoCampaigns[0],
    goal: "website_visits",
    target_interests: ["risk management", "education"],
    max_impressions: 110_000,
    frequency_cap: 3,
    website_visits: 1_240,
    profile_visits: 620,
    review_note: null,
    reviewed_at: "2026-07-01T09:00:00Z",
    paid_at: "2026-07-02T09:00:00Z",
    activated_at: "2026-07-02T10:00:00Z",
    headline: "Master risk before reward",
    body: "A practical course on position sizing and disciplined execution.",
    media_url: null,
    destination_url: "https://example.com/course",
    cta_type: "learn_more",
    cta_label: "Learn more",
  },
};

// Preview-only quote simulator (clearly marked sample). Real quotes always
// come from the quote_campaign_price RPC via /api/portal/quote.
const DEMO_ELIGIBLE: Record<string, number> = {
  "All traders": 240_000,
  "Forex traders": 128_000,
  "Signal followers": 86_000,
  "Active MetaTrader users": 74_000,
  "New traders": 52_000,
  "Funded traders": 19_000,
};

export function demoQuote(input: {
  targetAudience: string | null;
  audienceSize: number;
  durationDays: number;
}): QuoteResult {
  const eligible = DEMO_ELIGIBLE[input.targetAudience ?? "All traders"] ?? 60_000;
  const size = Math.min(Math.max(0, input.audienceSize), eligible);
  const frequencyCap = 3;
  const maxImpressions = Math.round(size * frequencyCap * (input.durationDays / 7));
  // Illustrative NGN pricing — not a real rate card.
  const price = Math.max(5_000, Math.round((maxImpressions / 1000) * 45));
  return {
    eligibleAudience: eligible,
    maxImpressions,
    frequencyCap,
    price,
    currency: "NGN",
    sample: true,
  };
}
