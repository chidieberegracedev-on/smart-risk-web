// Shared shapes between /api/portal/* responses and portal UI.

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
