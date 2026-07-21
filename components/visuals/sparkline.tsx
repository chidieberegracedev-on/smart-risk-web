"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

// A small equity-curve sparkline — draws itself in on view. Illustrative,
// not real data (it sits inside a clearly-labelled preview).
const POINTS = [6, 8, 5, 9, 7, 11, 10, 13, 12, 15, 14, 17];

export function Sparkline({ width = 108, height = 34 }: { width?: number; height?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const max = Math.max(...POINTS);
  const min = Math.min(...POINTS);
  const stepX = width / (POINTS.length - 1);
  const norm = (v: number) => height - ((v - min) / (max - min)) * (height - 6) - 3;
  const d = POINTS.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${norm(v)}`).join(" ");
  const area = `${d} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg ref={ref} width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FB97F" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3FB97F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#spark-fill)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#3FB97F"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.2 }}
      />
    </svg>
  );
}
