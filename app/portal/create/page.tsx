"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/portal/auth-context";
import { SponsoredPreview } from "@/components/portal/sponsored-preview";
import { portalPost } from "@/lib/portal/use-portal-data";
import { demoQuote } from "@/lib/portal/demo";
import type { QuoteResult } from "@/lib/portal/types";
import { GOAL_LABELS, CTA_OPTIONS, fmtNum, fmtMoney } from "@/lib/portal/format";
import { cn } from "@/lib/cn";

const AUDIENCES = [
  "All traders",
  "Forex traders",
  "Signal followers",
  "Active MetaTrader users",
  "New traders",
  "Funded traders",
];

type Goal = "views" | "profile_visits" | "website_visits";

export default function CreatePromotionPage() {
  const { user, preview } = useAuth();
  const router = useRouter();

  // ── form state ──
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal>("website_visits");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [ctaType, setCtaType] = useState<string>("learn_more");
  const [ctaLabel, setCtaLabel] = useState("Learn more");
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [audienceSize, setAudienceSize] = useState(0);
  const [touchedSize, setTouchedSize] = useState(false);

  // ── quote state (backend is source of truth) ──
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string } | null>(null);

  const eligible = quote?.eligibleAudience ?? 0;

  // Default the audience-size slider to the eligible max once known.
  useEffect(() => {
    if (!touchedSize && eligible > 0) setAudienceSize(eligible);
  }, [eligible, touchedSize]);

  // ── debounced live quote ──
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const requestQuote = useCallback(async () => {
    setQuoting(true);
    setQuoteError(null);
    try {
      if (preview) {
        setQuote(demoQuote({ targetAudience: audience, audienceSize, durationDays }));
      } else {
        const q = await portalPost<QuoteResult>(user, "/api/portal/quote", {
          targetAudience: audience,
          targetInterests: interests,
          audienceSize,
          durationDays,
          goal,
        });
        setQuote(q);
      }
    } catch {
      setQuote(null);
      setQuoteError(
        "We couldn't get a live price right now. You can't submit until a price is available — try again shortly."
      );
    } finally {
      setQuoting(false);
    }
  }, [preview, user, audience, interests, audienceSize, durationDays, goal]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(requestQuote, 500);
    return () => clearTimeout(timer.current);
  }, [requestQuote]);

  const addInterest = () => {
    const v = interestInput.trim();
    if (v && !interests.includes(v) && interests.length < 10) {
      setInterests((p) => [...p, v]);
    }
    setInterestInput("");
  };

  const canSubmit =
    name.trim() &&
    headline.trim() &&
    durationDays > 0 &&
    quote?.price != null &&
    !quoting &&
    !submitting;

  const submit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      if (preview) {
        // No backend in preview — simulate a successful submission.
        await new Promise((r) => setTimeout(r, 600));
        setDone({ id: "preview" });
        return;
      }
      const res = await portalPost<{ id: string }>(
        user,
        "/api/portal/campaigns/create",
        {
          name: name.trim(),
          goal,
          targetAudience: audience,
          targetInterests: interests,
          audienceSize,
          durationDays,
          headline: headline.trim(),
          body: body.trim(),
          destinationUrl: destinationUrl.trim() || null,
          ctaType,
          ctaLabel: ctaLabel.trim() || null,
        }
      );
      setDone({ id: res.id });
    } catch (e) {
      setSubmitError(
        (e as Error).message === "quote_unavailable"
          ? "We couldn't confirm a price at submit time. Please try again."
          : "We couldn't submit your promotion. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <SubmittedState id={done.id} preview={preview} router={router} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
      {/* ── Config ── */}
      <div className="flex flex-col gap-8">
        <Section title="1. Your ad" step>
          <Field label="Campaign name (internal)">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. October signals push"
              className={inputCls}
            />
          </Field>
          <Field label="Headline">
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="A clear, honest headline"
              className={inputCls}
              maxLength={60}
            />
          </Field>
          <Field label="Body">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What are you offering the trader community?"
              rows={3}
              className={cn(inputCls, "h-auto py-3")}
              maxLength={280}
            />
          </Field>
          <Field label="Image URL (optional)">
            <input
              value={""}
              readOnly
              placeholder="Upload happens in the app — leave blank on web for now"
              className={cn(inputCls, "cursor-not-allowed opacity-60")}
            />
          </Field>
        </Section>

        <Section title="2. Goal & action" step>
          <Field label="Goal">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                <Chip key={g} active={goal === g} onClick={() => setGoal(g)}>
                  {GOAL_LABELS[g]}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="Call to action">
            <div className="flex flex-wrap gap-2">
              {CTA_OPTIONS.map((o) => (
                <Chip
                  key={o.type}
                  active={ctaType === o.type}
                  onClick={() => {
                    setCtaType(o.type);
                    if (o.type !== "custom") setCtaLabel(o.label);
                  }}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          </Field>
          {ctaType === "custom" && (
            <Field label="Custom button label">
              <input
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                className={inputCls}
                maxLength={20}
              />
            </Field>
          )}
          <Field label="Destination URL">
            <input
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="3. Audience & duration" step>
          <Field label="Who should see this?">
            <select
              value={audience}
              onChange={(e) => {
                setAudience(e.target.value);
                setTouchedSize(false);
              }}
              className={inputCls}
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Interests (optional)">
            <div className="flex flex-wrap gap-2">
              {interests.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-portal-elevated px-3 py-1 text-sm text-portal-text"
                >
                  {t}
                  <button
                    onClick={() => setInterests((p) => p.filter((x) => x !== t))}
                    className="text-portal-faint hover:text-portal-text"
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterest();
                  }
                }}
                onBlur={addInterest}
                placeholder="Add an interest…"
                className="h-9 min-w-[140px] flex-1 rounded-full bg-portal-elevated px-3 text-sm text-portal-text outline-none placeholder:text-portal-faint"
              />
            </div>
          </Field>

          <Field
            label={`Audience size — up to ${fmtNum(eligible)} eligible`}
          >
            <input
              type="range"
              min={0}
              max={Math.max(eligible, 1)}
              value={Math.min(audienceSize, eligible || 0)}
              onChange={(e) => {
                setTouchedSize(true);
                setAudienceSize(Number(e.target.value));
              }}
              disabled={eligible === 0}
              className="w-full accent-portal-accent"
            />
            <p className="data mt-1 text-sm text-portal-muted">
              {fmtNum(Math.min(audienceSize, eligible))} people
            </p>
          </Field>

          <Field label={`Duration — ${durationDays} days`}>
            <input
              type="range"
              min={1}
              max={30}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-portal-accent"
            />
          </Field>
        </Section>
      </div>

      {/* ── Sticky preview + quote ── */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="flex flex-col gap-6">
          <SponsoredPreview
            headline={headline}
            body={body}
            destinationUrl={destinationUrl}
            ctaLabel={ctaLabel}
          />

          {/* Live price chain */}
          <div className="rounded-2xl bg-portal-surface p-5 shadow-portal-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-portal-text">Estimate</h3>
              {quoting && <span className="text-xs text-portal-faint">Updating…</span>}
            </div>

            {quoteError ? (
              <p className="mt-3 text-sm text-portal-danger">{quoteError}</p>
            ) : quote ? (
              <>
                <dl className="mt-4 flex flex-col gap-2.5">
                  <QuoteRow label="Estimated reach" value={`up to ${fmtNum(quote.eligibleAudience)}`} />
                  <QuoteRow
                    label="Frequency cap"
                    value={quote.frequencyCap != null ? `${quote.frequencyCap}×` : "—"}
                  />
                  <QuoteRow
                    label="Max possible impressions"
                    value={fmtNum(quote.maxImpressions)}
                  />
                </dl>
                <div className="mt-4 border-t border-portal-line pt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-portal-faint">
                    Total price
                  </p>
                  <p className="data mt-1 text-2xl font-semibold text-portal-text">
                    {fmtMoney(quote.price, quote.currency)}
                  </p>
                  {quote.sample && (
                    <p className="mt-1 text-xs text-portal-pending">
                      Sample estimate (preview mode)
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-portal-muted">
                Set your audience and duration to see the estimate.
              </p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-portal-faint">
              These are maximums — estimated reach and maximum possible
              impressions, never guaranteed delivery. Final price is confirmed by
              our system, not calculated here.
            </p>

            {submitError && (
              <p className="mt-3 text-sm text-portal-danger">{submitError}</p>
            )}

            <button
              onClick={submit}
              disabled={!canSubmit}
              className="mt-5 h-12 w-full cursor-pointer rounded-full bg-portal-accent text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
            <p className="mt-3 text-center text-xs text-portal-faint">
              Your promotion goes to review first — it only goes live after
              approval and payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-portal-line bg-portal-surface px-4 text-sm text-portal-text outline-none transition-colors placeholder:text-portal-faint focus:border-portal-accent";

function Section({
  title,
  children,
  step,
}: {
  title: string;
  children: React.ReactNode;
  step?: boolean;
}) {
  return (
    <section className="rounded-2xl bg-portal-surface p-6 shadow-portal-soft">
      <h2 className="text-base font-semibold text-portal-text">{title}</h2>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-portal-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full px-4 py-2 text-sm transition-colors",
        active
          ? "bg-portal-accent text-white"
          : "bg-portal-elevated text-portal-muted hover:text-portal-text"
      )}
    >
      {children}
    </button>
  );
}
function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-sm text-portal-muted">{label}</dt>
      <dd className="data text-sm font-medium text-portal-text">{value}</dd>
    </div>
  );
}

function SubmittedState({
  id,
  preview,
  router,
}: {
  id: string;
  preview: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-portal-surface p-10 text-center shadow-portal-soft">
      <span
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "#7FB0691a", boxShadow: "inset 0 0 0 1px #7FB06955" }}
      >
        <span className="h-3 w-3 rounded-full bg-portal-positive" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-portal-text">
        Submitted for review
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-portal-muted">
        {preview
          ? "In a live environment this would create your campaign as “Under review”. Connect Supabase to submit for real."
          : "Your promotion is now with the review team. Once it's approved you'll get a link to pay and activate it."}
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Link
          href="/portal/campaigns"
          className="inline-flex h-11 items-center rounded-full bg-portal-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          View campaigns
        </Link>
        <button
          onClick={() => router.refresh()}
          className="inline-flex h-11 cursor-pointer items-center rounded-full border border-portal-line px-6 text-sm font-medium text-portal-text transition-colors hover:bg-portal-elevated"
        >
          Create another
        </button>
      </div>
    </div>
  );
}
