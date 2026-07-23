"use client";

import Link from "next/link";
import { useAuth } from "@/components/portal/auth-context";
import { useEffect, useState } from "react";
import { demoCampaignDetail } from "@/lib/portal/demo";
import type { CampaignDetail } from "@/lib/portal/types";
import { StatusText } from "@/components/portal/status-text";
import { SponsoredPreview } from "@/components/portal/sponsored-preview";
import { fmtNum, fmtMoney, fmtDate, GOAL_LABELS } from "@/lib/portal/format";

type Load =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready"; data: CampaignDetail };

export default function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, preview } = useAuth();
  const [load, setLoad] = useState<Load>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (preview) {
        const d = demoCampaignDetail[params.id];
        setLoad(
          d
            ? { state: "ready", data: d }
            : { state: "error", message: "This sample campaign has no detail view." }
        );
        return;
      }
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/portal/campaigns/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.status === 404) throw new Error("not_found");
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as { campaign: CampaignDetail };
        if (!cancelled) setLoad({ state: "ready", data: json.campaign });
      } catch (e) {
        if (!cancelled)
          setLoad({
            state: "error",
            message:
              (e as Error).message === "not_found"
                ? "We couldn't find that campaign, or it isn't yours."
                : "We couldn't load this campaign right now.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id, user, preview]);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/portal/campaigns"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-portal-muted transition-colors hover:text-portal-text"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M8.5 3 4.5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All campaigns
      </Link>

      {load.state === "loading" ? (
        <div className="h-96 animate-pulse rounded-2xl bg-portal-surface" />
      ) : load.state === "error" ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-portal-muted">{load.message}</p>
        </Card>
      ) : (
        <Detail c={load.data} />
      )}
    </div>
  );
}

function Detail({ c }: { c: CampaignDetail }) {
  const awaitingPayment = c.status === "approved_payment_required";
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-portal-text">{c.name}</h2>
          <div className="mt-2">
            <StatusText status={c.status} />
          </div>
        </div>
        {awaitingPayment && (
          <Link
            href={`/pay/${c.id}`}
            className="inline-flex h-11 items-center rounded-full bg-portal-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Pay &amp; activate
          </Link>
        )}
      </div>

      {/* Rejected → reviewer note front and center */}
      {c.status === "rejected" && c.review_note && (
        <Card className="border border-portal-danger/30 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-portal-danger">
            Why this wasn&apos;t approved
          </p>
          <p className="mt-2 text-sm leading-relaxed text-portal-text">{c.review_note}</p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr,1.1fr]">
        {/* Preview */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-portal-faint">
            Sponsored post preview
          </p>
          <SponsoredPreview
            headline={c.headline}
            body={c.body}
            destinationUrl={c.destination_url}
            ctaLabel={c.cta_label}
            mediaUrl={c.media_url}
          />
        </div>

        {/* Settings + metrics */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-portal-text">Settings</h3>
            <dl className="mt-4 flex flex-col gap-3">
              <Row label="Goal" value={c.goal ? GOAL_LABELS[c.goal] ?? c.goal : "—"} />
              <Row label="Audience" value={c.target_audience ?? "—"} />
              <Row
                label="Interests"
                value={c.target_interests?.length ? c.target_interests.join(", ") : "—"}
              />
              <Row label="Duration" value={c.duration_days != null ? `${c.duration_days} days` : "—"} />
              <Row
                label="Max possible impressions"
                value={fmtNum(c.max_impressions)}
              />
              <Row label="Frequency cap" value={c.frequency_cap != null ? `${c.frequency_cap}×` : "—"} />
              <Row label="Price" value={fmtMoney(c.price_amount, c.price_currency)} strong />
              {c.destination_url && (
                <Row label="Destination" value={c.destination_url} />
              )}
            </dl>
          </Card>

          {/* Metrics — real counters only */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-portal-text">Performance</h3>
            {c.status === "active" || c.status === "completed" ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Metric label="Impressions" value={fmtNum(c.impressions)} />
                <Metric label="Reach" value={fmtNum(c.reach)} />
                <Metric label="Clicks" value={fmtNum(c.clicks)} />
                <Metric label="Website visits" value={fmtNum(c.website_visits)} />
                <Metric label="Profile visits" value={fmtNum(c.profile_visits)} />
                <Metric
                  label="CTR"
                  value={
                    c.impressions > 0
                      ? `${((c.clicks / c.impressions) * 100).toFixed(2)}%`
                      : "—"
                  }
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-portal-muted">
                Performance appears here once the campaign is live.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Status timeline */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-portal-text">Status timeline</h3>
        <Timeline c={c} />
      </Card>
    </>
  );
}

function Timeline({ c }: { c: CampaignDetail }) {
  const steps = [
    { label: "Created", at: c.created_at, done: true },
    {
      label: "Reviewed",
      at: c.reviewed_at,
      done: !["draft", "pending_review", "under_review"].includes(c.status),
    },
    {
      label: "Paid",
      at: c.paid_at,
      done: ["active", "completed"].includes(c.status) || Boolean(c.paid_at),
    },
    {
      label: "Active",
      at: c.activated_at,
      done: ["active", "completed"].includes(c.status),
    },
  ];
  const rejected = c.status === "rejected";
  return (
    <ol className="mt-5 flex flex-col gap-0">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={s.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                  s.done ? "bg-portal-positive" : "bg-portal-line"
                }`}
              />
              {!isLast && (
                <span
                  className={`w-px flex-1 ${s.done ? "bg-portal-positive/50" : "bg-portal-line"}`}
                />
              )}
            </div>
            <div className={isLast ? "" : "pb-6"}>
              <p
                className={`text-sm font-medium ${
                  s.done ? "text-portal-text" : "text-portal-faint"
                }`}
              >
                {s.label}
              </p>
              <p className="text-xs text-portal-faint">
                {s.done ? fmtDate(s.at) : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
      {rejected && (
        <li className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-0.5 h-4 w-4 rounded-full bg-portal-danger" />
          </div>
          <p className="text-sm font-medium text-portal-danger">Rejected</p>
        </li>
      )}
    </ol>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-portal-surface shadow-portal-soft ${className}`}>
      {children}
    </section>
  );
}
function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-sm text-portal-muted">{label}</dt>
      <dd
        className={`min-w-0 truncate text-right text-sm ${
          strong ? "data font-semibold text-portal-text" : "text-portal-text"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-portal-faint">{label}</p>
      <p className="data mt-1 text-lg font-semibold text-portal-text">{value}</p>
    </div>
  );
}
