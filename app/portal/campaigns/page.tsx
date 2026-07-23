"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePortalData } from "@/lib/portal/use-portal-data";
import { demoCampaigns } from "@/lib/portal/demo";
import type { CampaignListItem } from "@/lib/portal/types";
import { StatusText } from "@/components/portal/status-text";
import { CAMPAIGN_FILTERS, fmtNum, fmtMoney, fmtDate } from "@/lib/portal/format";
import { cn } from "@/lib/cn";

export default function CampaignsPage() {
  const load = usePortalData<{ campaigns: CampaignListItem[] } | CampaignListItem[]>(
    "/api/portal/campaigns",
    { campaigns: demoCampaigns }
  );
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const campaigns: CampaignListItem[] = useMemo(() => {
    if (load.state !== "ready") return [];
    return Array.isArray(load.data) ? load.data : load.data.campaigns;
  }, [load]);

  const filtered = useMemo(() => {
    const f = CAMPAIGN_FILTERS.find((x) => x.key === filter) ?? CAMPAIGN_FILTERS[0];
    const q = query.trim().toLowerCase();
    return campaigns.filter(
      (c) =>
        f.match(c.status) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          (c.target_audience ?? "").toLowerCase().includes(q))
    );
  }, [campaigns, filter, query]);

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {CAMPAIGN_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  filter === f.key
                    ? "bg-portal-elevated font-medium text-portal-text"
                    : "text-portal-muted hover:text-portal-text"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Link
            href="/portal/create"
            className="inline-flex h-9 items-center rounded-full bg-portal-accent px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + Create promotion
          </Link>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or audience…"
          className="h-11 w-full max-w-sm rounded-xl border border-portal-line bg-portal-surface px-4 text-sm text-portal-text outline-none transition-colors placeholder:text-portal-faint focus:border-portal-accent"
        />
      </div>

      {/* Table */}
      {load.state === "loading" ? (
        <div className="h-64 animate-pulse rounded-2xl bg-portal-surface" />
      ) : load.state === "error" ? (
        <p className="text-sm text-portal-danger">{load.message}</p>
      ) : filtered.length === 0 ? (
        <EmptyState hasAny={campaigns.length > 0} />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-portal-surface shadow-portal-soft">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-portal-line text-left text-xs uppercase tracking-wider text-portal-faint">
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Audience</Th>
                <Th right>Duration</Th>
                <Th right>Impressions</Th>
                <Th right>Reach</Th>
                <Th right>Clicks</Th>
                <Th right>Price</Th>
                <Th right>Created</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="group border-b border-portal-line/70 last:border-0 hover:bg-portal-elevated/50"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/portal/campaigns/${c.id}`}
                      className="font-medium text-portal-text group-hover:text-portal-accent"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusText status={c.status} />
                  </td>
                  <td className="px-4 py-3.5 text-portal-muted">
                    {c.target_audience ?? "—"}
                  </td>
                  <Td right>{c.duration_days != null ? `${c.duration_days}d` : "—"}</Td>
                  <Td right>{fmtNum(c.impressions)}</Td>
                  <Td right>{fmtNum(c.reach)}</Td>
                  <Td right>{fmtNum(c.clicks)}</Td>
                  <Td right>{fmtMoney(c.price_amount, c.price_currency)}</Td>
                  <Td right>{fmtDate(c.created_at)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={cn("px-4 py-3 font-medium", right && "text-right")}>{children}</th>
  );
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <td className={cn("data px-4 py-3.5 text-portal-muted", right && "text-right")}>
      {children}
    </td>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="rounded-2xl bg-portal-surface p-12 text-center shadow-portal-soft">
      <h2 className="text-lg font-semibold text-portal-text">
        {hasAny ? "No campaigns match this filter" : "No campaigns yet"}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-portal-muted">
        {hasAny
          ? "Try a different filter or clear your search."
          : "Create your first promotion to reach the trader community."}
      </p>
      {!hasAny && (
        <Link
          href="/portal/create"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-portal-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Create promotion
        </Link>
      )}
    </div>
  );
}
