"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/portal/auth-context";
import { StatusText } from "@/components/portal/status-text";
import { demoOverview } from "@/lib/portal/demo";
import type { OverviewPayload } from "@/lib/portal/types";

// Overview — adaptive to the account's state, exactly like the app's
// Advertiser Center. Real sums only; honest empty states; no invented deltas.

type Load =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready"; data: OverviewPayload };

export default function OverviewPage() {
  const { user, preview } = useAuth();
  const [load, setLoad] = useState<Load>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (preview) {
        setLoad({ state: "ready", data: demoOverview });
        return;
      }
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/portal/overview", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`overview ${res.status}`);
        const data = (await res.json()) as OverviewPayload;
        if (!cancelled) setLoad({ state: "ready", data });
      } catch {
        if (!cancelled)
          setLoad({
            state: "error",
            message:
              "We couldn't load your overview right now. Refresh to try again.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, preview]);

  if (load.state === "loading") return <Skeleton />;
  if (load.state === "error")
    return <p className="text-sm text-portal-danger">{load.message}</p>;

  const { application, totals, attention, recent } = load.data;
  const appStatus = application?.status ?? null;

  // ── Not an advertiser yet ──
  if (!application) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <h2 className="text-2xl font-semibold">Become an advertiser</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-portal-muted">
          Promote your business, content, or services to the Smart Risk trader
          community. Apply once — the review usually takes a few days.
        </p>
        <Link
          href="/portal/verification"
          className="mt-7 inline-flex h-11 items-center rounded-full bg-portal-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Start your application
        </Link>
      </Card>
    );
  }

  // ── Applicant (not yet approved) ──
  if (appStatus !== "approved") {
    return (
      <Card className="mx-auto max-w-xl p-10">
        <h2 className="text-xl font-semibold">Your application</h2>
        <div className="mt-4">
          <StatusText status={appStatus ?? "pending_review"} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-portal-muted">
          {appStatus === "needs_info"
            ? "The review team needs a bit more information before approving your application."
            : appStatus === "rejected"
              ? "Your application wasn't approved this time."
              : "Your application is with the review team. You'll be notified as soon as it's decided."}
        </p>
        {application.review_note && (
          <p className="mt-4 rounded-xl bg-portal-elevated p-4 text-sm leading-relaxed text-portal-text">
            <span className="font-medium">Reviewer note:</span>{" "}
            {application.review_note}
          </p>
        )}
        <Link
          href="/portal/verification"
          className="mt-6 inline-flex text-sm text-portal-accent hover:underline"
        >
          View application
        </Link>
      </Card>
    );
  }

  // ── Approved: the full dashboard ──
  const spent = totals.spent[0];
  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Active campaigns" value={String(totals.activeCampaigns)} />
        <Stat label="Total impressions" value={fmt(totals.impressions)} />
        <Stat label="Total reach" value={fmt(totals.reach)} />
        <Stat label="Website visits" value={fmt(totals.websiteVisits)} />
        <Stat
          label="Total spent"
          value={
            spent
              ? `${fmt(spent.amount)} ${spent.currency}${totals.spent.length > 1 ? " +" : ""}`
              : "—"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        {/* Needs attention */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Needs your attention</h2>
            <Link
              href="/portal/create"
              className="inline-flex h-9 items-center rounded-full bg-portal-accent px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              + Create promotion
            </Link>
          </div>
          {attention.length === 0 ? (
            <p className="mt-5 text-sm text-portal-muted">
              Nothing needs your attention right now.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {attention.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 border-b border-portal-line py-3.5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <StatusText status={c.status} />
                  </div>
                  {c.status === "approved_payment_required" && (
                    <Link
                      href={`/pay/${c.id}`}
                      className="shrink-0 text-sm font-medium text-portal-accent hover:underline"
                    >
                      Pay &amp; activate
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent campaigns */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent campaigns</h2>
            <Link
              href="/portal/campaigns"
              className="text-sm text-portal-accent hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-5 text-sm text-portal-muted">
              No campaigns yet. Your first promotion will appear here.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {recent.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 border-b border-portal-line py-3.5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <StatusText status={c.status} />
                  </div>
                  <span className="data shrink-0 text-xs text-portal-muted">
                    {fmt(c.impressions)} impr.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Impressions chart slot — honest until event data lands (Phase 3) */}
      <Card className="p-6">
        <h2 className="text-base font-semibold">Impressions over time</h2>
        <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-portal-elevated/60">
          <p className="max-w-sm text-center text-sm text-portal-muted">
            The daily timeline appears here once event data is available for
            your campaigns — see Analytics.
          </p>
        </div>
      </Card>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl bg-portal-surface shadow-portal-soft ${className}`}
    >
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-portal-faint">
        {label}
      </p>
      <p className="data mt-2 text-2xl font-semibold">{value}</p>
    </Card>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-portal-surface" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-portal-surface" />
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}
