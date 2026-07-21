"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

function easeOutExpo(t: number) {
  // Mirror of the [0.16,1,0.3,1] feel for a scalar count.
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// Counts a number up to `to` once it scrolls into view. Respects reduced
// motion by snapping to the final value.
export function useCountUp(to: number, decimals = 0, duration = 1100) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(to * easeOutExpo(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return { ref, formatted };
}

export { EASE_OUT };
