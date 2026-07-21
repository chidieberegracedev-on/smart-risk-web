// Sample payload for PREVIEW MODE only (NEXT_PUBLIC_PORTAL_PREVIEW=1 while
// Firebase is not configured). Always shown with a visible "Preview mode —
// sample data" banner; never used when real auth is available.

import type { OverviewPayload } from "./types";

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
