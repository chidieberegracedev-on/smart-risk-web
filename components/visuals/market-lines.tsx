"use client";

import { useEffect, useRef } from "react";

// Live, code-built auth visual: slow flowing chart-like lines drifting over a
// dark gradient — market-themed, calm, premium. Canvas + rAF; falls back to a
// static gradient under prefers-reduced-motion.

const LINES = [
  { color: "rgba(91,140,255,0.55)", amp: 42, speed: 0.12, yOff: 0.42, width: 1.6 },
  { color: "rgba(63,185,127,0.4)", amp: 30, speed: 0.09, yOff: 0.58, width: 1.3 },
  { color: "rgba(255,255,255,0.16)", amp: 54, speed: 0.06, yOff: 0.5, width: 1 },
  { color: "rgba(91,140,255,0.22)", amp: 24, speed: 0.15, yOff: 0.68, width: 1 },
];

export function MarketLines() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pseudo-random but stable wobble so lines feel like price paths, not sine waves.
    const wobble = (x: number, seed: number) =>
      Math.sin(x * 0.011 + seed) * 0.55 +
      Math.sin(x * 0.023 + seed * 2.1) * 0.3 +
      Math.sin(x * 0.047 + seed * 3.7) * 0.15;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      LINES.forEach((line, i) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        const phase = t * line.speed * 0.001 * 60;
        for (let x = 0; x <= w; x += 4) {
          const y =
            h * line.yOff + wobble(x + phase * 18, i * 7 + 1) * line.amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
