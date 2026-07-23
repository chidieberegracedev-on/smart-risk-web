// Small shared formatters for the portal UI.

export function fmtNum(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

export function fmtMoney(
  amount: number | null | undefined,
  currency: string | null | undefined
): string {
  if (amount == null || !currency) return "—";
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// The app's campaign filters.
export const CAMPAIGN_FILTERS = [
  { key: "all", label: "All", match: () => true },
  {
    key: "review",
    label: "Under review",
    match: (s: string) => ["pending_review", "under_review", "needs_info"].includes(s),
  },
  {
    key: "payment",
    label: "Payment required",
    match: (s: string) => ["approved_payment_required", "payment_processing"].includes(s),
  },
  { key: "active", label: "Active", match: (s: string) => s === "active" },
  { key: "completed", label: "Completed", match: (s: string) => s === "completed" },
  { key: "rejected", label: "Rejected", match: (s: string) => s === "rejected" },
] as const;

export const GOAL_LABELS: Record<string, string> = {
  views: "Views",
  profile_visits: "Profile visits",
  website_visits: "Website visits",
};

export const CTA_OPTIONS = [
  { type: "visit", label: "Visit" },
  { type: "follow", label: "Follow" },
  { type: "learn_more", label: "Learn more" },
  { type: "custom", label: "Custom" },
] as const;
