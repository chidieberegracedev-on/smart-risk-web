// Shared shapes between /api/portal/* responses and portal UI.

export interface CampaignListItem {
  id: string;
  name: string;
  status: string;
  target_audience: string | null;
  duration_days: number | null;
  impressions: number;
  reach: number;
  clicks: number;
  price_amount: number | null;
  price_currency: string | null;
  created_at: string | null;
}

export interface CampaignDetail extends CampaignListItem {
  goal: string | null;
  target_interests: string[] | null;
  max_impressions: number | null;
  frequency_cap: number | null;
  website_visits: number | null;
  profile_visits: number | null;
  review_note: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
  activated_at: string | null;
  headline: string | null;
  body: string | null;
  media_url: string | null;
  destination_url: string | null;
  cta_type: string | null;
  cta_label: string | null;
}

export interface QuoteResult {
  eligibleAudience: number;
  maxImpressions: number | null;
  frequencyCap: number | null;
  price: number | null;
  currency: string | null;
  /** True when the numbers are illustrative (preview mode), not a real quote. */
  sample?: boolean;
}

export interface OverviewPayload {
  profile: {
    display_name?: string | null;
    email?: string | null;
    display_currency?: string | null;
  } | null;
  application: {
    status?: string | null;
    type?: string | null;
    category?: string | null;
    tier?: number | null;
    review_note?: string | null;
  } | null;
  totals: {
    activeCampaigns: number;
    impressions: number;
    reach: number;
    clicks: number;
    websiteVisits: number;
    spent: { currency: string; amount: number }[];
  };
  attention: { id: string; name: string; status: string }[];
  recent: {
    id: string;
    name: string;
    status: string;
    impressions: number;
    created_at: string | null;
  }[];
}
