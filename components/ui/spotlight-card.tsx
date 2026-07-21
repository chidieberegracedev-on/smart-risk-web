"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

// Card with a soft radial highlight that follows the cursor, plus a subtle
// border-glow. Reads as a refined, "lit" surface without being flashy.
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border border-line bg-panel/60 transition-colors duration-300 hover:border-line-strong",
        className
      )}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--x) var(--y), rgba(91,140,255,0.10), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
