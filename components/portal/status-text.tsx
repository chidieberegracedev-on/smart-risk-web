// Status = standalone colored text with a dot — never bordered pills.
const MAP: Record<string, { label: string; cls: string }> = {
  active: { label: "Active", cls: "text-portal-positive" },
  completed: { label: "Completed", cls: "text-portal-muted" },
  draft: { label: "Draft", cls: "text-portal-faint" },
  pending_review: { label: "Under review", cls: "text-portal-pending" },
  under_review: { label: "Under review", cls: "text-portal-pending" },
  needs_info: { label: "Needs info", cls: "text-portal-pending" },
  approved: { label: "Approved", cls: "text-portal-positive" },
  approved_payment_required: { label: "Payment required", cls: "text-portal-pending" },
  payment_processing: { label: "Processing payment", cls: "text-portal-pending" },
  rejected: { label: "Rejected", cls: "text-portal-danger" },
  failed: { label: "Failed", cls: "text-portal-danger" },
  succeeded: { label: "Paid", cls: "text-portal-positive" },
};

export function StatusText({ status }: { status: string }) {
  const s = MAP[status] ?? { label: status.replaceAll("_", " "), cls: "text-portal-muted" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
