"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

// A trade-quality score dial (0–100). Animated SVG arc that fills on view.
// Framed as a quality/discipline score — NOT a prediction or win-rate.
export function TradeScoreDial({
  score = 78,
  label = "Setup quality",
  size = 132,
}: {
  score?: number;
  label?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // 270° gauge (three-quarter arc)
  const arcFraction = 0.75;
  const filled = (score / 100) * arcFraction;
  const dash = c * arcFraction;
  const offset = c * (arcFraction - filled);

  const tone =
    score >= 70 ? "#3FB97F" : score >= 45 ? "#E0A63C" : "#E5484D";

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-[135deg]"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#26262B"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
          {/* Value */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            initial={{ strokeDashoffset: dash }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: dash }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.15 }}
            style={{ filter: `drop-shadow(0 0 6px ${tone}55)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="data text-3xl font-semibold text-text"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="data text-[10px] uppercase tracking-widest text-faint">
            / 100
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted">{label}</span>
    </div>
  );
}
