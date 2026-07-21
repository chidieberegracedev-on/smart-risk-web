"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { TradeScoreDial } from "./trade-score-dial";
import { RiskRewardBar } from "./risk-reward-bar";
import { Sparkline } from "./sparkline";
import { useCountUp } from "@/lib/useCountUp";
import { EASE_OUT } from "@/lib/motion";

// The signature code-built product visual: a stylised risk console that
// doubles as illustration AND a demonstration of the product. Now with a
// cursor-driven 3D tilt, layered glass, a cursor glare, and richer internals.
// All values are illustrative — clearly a mockup, never a live feed or claim.

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
    tone === "accent" ? "text-accent" : tone === "verified" ? "text-verified" : "text-text";
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-panel/80 p-3 panel-ring">
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
    <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-[linear-gradient(180deg,rgba(91,140,255,0.14),transparent)] p-4">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-accent">
            Recommended position size
          </span>
          <span ref={ref} className="data text-4xl font-semibold text-text">
            {formatted}
            <span className="ml-2 text-base font-medium text-muted">lots</span>
          </span>
        </div>
        <span className="data mb-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-xs text-accent">
          ≈ 0.5% risk
        </span>
      </div>
    </div>
  );
}

export function RiskConsole() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const rotY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
      className="relative w-full max-w-md"
      style={{ perspective: 1400 }}
    >
      {/* ambient glow so the card has presence on any section */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/10 blur-3xl" />

      <motion.div
        ref={wrapRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="grain relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-b from-panel-2 to-panel p-5 shadow-[0_50px_130px_-40px_rgba(0,0,0,0.95)]"
      >
        {/* top sheen + cursor glare */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-40"
          style={{
            background: useTransform(
              glareX,
              (x) =>
                `radial-gradient(500px circle at ${x} 0%, rgba(255,255,255,0.10), transparent 45%)`
            ),
          }}
        />

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
        <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-5 rounded-2xl border border-line bg-panel/70 p-4 panel-ring">
          <TradeScoreDial score={78} />
          <RiskRewardBar risk={1} reward={2.4} />
        </div>

        {/* Equity trend + behavioral warning */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-panel/60 p-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
              Journal · 30d discipline
            </span>
            <span className="data text-sm font-semibold text-verified">Trending up</span>
          </div>
          <Sparkline />
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-caution/25 bg-caution/[0.06] p-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="mt-0.5 shrink-0 text-caution"
            aria-hidden="true"
          >
            <path d="M8 1.5 15 14H1L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M8 6.5v3.2M8 11.6v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-xs leading-relaxed text-muted">
            This is your <span className="font-medium text-caution">3rd trade today</span> — check
            it against your plan before entering.
          </p>
        </div>

        <p className="mt-3 text-center text-[10px] text-faint">
          Illustrative preview · not a live trade or a recommendation
        </p>
      </motion.div>
    </motion.div>
  );
}
