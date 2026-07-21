"use client";

import { motion } from "framer-motion";
import { TradeScoreDial } from "./trade-score-dial";
import { RiskRewardBar } from "./risk-reward-bar";
import { useCountUp } from "@/lib/useCountUp";
import { EASE_OUT } from "@/lib/motion";

// The signature code-built product visual: a stylised risk console that doubles
// as illustration AND a demonstration of what the product does. All values are
// illustrative — clearly a mockup, not a live feed or a claim.

function Field({
  label,
  value,
  unit,
  tone = "text",
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "text" | "accent" | "verified";
}) {
  const color =
    tone === "accent"
      ? "text-accent"
      : tone === "verified"
        ? "text-verified"
        : "text-text";
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-panel/70 p-3">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
        {label}
      </span>
      <span className={`data text-lg font-semibold ${color}`}>
        {value}
        {unit && <span className="ml-1 text-xs text-muted">{unit}</span>}
      </span>
    </div>
  );
}

function PositionReadout() {
  const { ref, formatted } = useCountUp(0.42, 2);
  return (
    <div className="flex items-end justify-between rounded-xl border border-accent/25 bg-[linear-gradient(180deg,rgba(91,140,255,0.10),transparent)] p-4">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-accent">
          Recommended position size
        </span>
        <span ref={ref} className="data text-4xl font-semibold text-text">
          {formatted}
          <span className="ml-2 text-base font-medium text-muted">lots</span>
        </span>
      </div>
      <span className="data mb-1 text-xs text-faint">≈ 0.5% risk</span>
    </div>
  );
}

export function RiskConsole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
      style={{ perspective: 1200 }}
      className="w-full max-w-md"
    >
      <div className="grain relative overflow-hidden rounded-3xl border border-line-strong bg-panel-2/90 p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15">
              <span className="h-2 w-2 rounded-sm bg-accent" />
            </span>
            <span className="text-sm font-medium text-text">Risk check</span>
          </div>
          <span className="data rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
            EUR/USD · signal
          </span>
        </div>

        <PositionReadout />

        {/* Inputs grid */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Field label="Account" value="8,000" unit="USD" />
          <Field label="Risk" value="0.5" unit="%" tone="accent" />
          <Field label="Stop" value="24" unit="pips" />
        </div>

        {/* Dial + R:R */}
        <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-5 rounded-2xl border border-line bg-panel/60 p-4">
          <TradeScoreDial score={78} />
          <RiskRewardBar risk={1} reward={2.4} />
        </div>

        {/* Behavioral warning line — the "protective layer" made visible */}
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-caution/25 bg-caution/[0.06] p-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="mt-0.5 shrink-0 text-caution"
            aria-hidden="true"
          >
            <path
              d="M8 1.5 15 14H1L8 1.5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path
              d="M8 6.5v3.2M8 11.6v.1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-xs leading-relaxed text-muted">
            This is your{" "}
            <span className="font-medium text-caution">3rd trade today</span> —
            check it against your plan before entering.
          </p>
        </div>

        <p className="mt-3 text-center text-[10px] text-faint">
          Illustrative preview · not a live trade or a recommendation
        </p>
      </div>
    </motion.div>
  );
}
