"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

// Visualises risk vs reward as two proportional segments.
// Makes the trade-off obvious at a glance — the core message of the product.
export function RiskRewardBar({
  risk = 1,
  reward = 2.4,
}: {
  risk?: number;
  reward?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const total = risk + reward;
  const riskPct = (risk / total) * 100;
  const rewardPct = (reward / total) * 100;
  const ratio = (reward / risk).toFixed(1);

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted">Risk / Reward</span>
        <span className="data text-sm font-semibold text-verified">
          1 : {ratio}
        </span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-panel-3">
        <motion.div
          className="h-full rounded-l-full bg-danger/80"
          initial={{ width: 0 }}
          animate={inView ? { width: `${riskPct}%` } : { width: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />
        <motion.div
          className="h-full rounded-r-full bg-verified"
          initial={{ width: 0 }}
          animate={inView ? { width: `${rewardPct}%` } : { width: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.12 }}
        />
      </div>
      <div className="flex justify-between">
        <span className="data text-xs text-faint">
          <span className="text-danger">●</span> Risk {risk}R
        </span>
        <span className="data text-xs text-faint">
          Reward {reward}R <span className="text-verified">●</span>
        </span>
      </div>
    </div>
  );
}
