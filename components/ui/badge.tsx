import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "verified" | "caution";

const tones: Record<Tone, string> = {
  neutral: "border-line-strong text-muted",
  accent: "border-accent/40 text-accent",
  verified: "border-verified/40 text-verified",
  caution: "border-caution/40 text-caution",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-panel/60 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// A small live-dot for "in development" / status moments.
export function Dot({ tone = "verified" }: { tone?: Tone }) {
  const color =
    tone === "accent"
      ? "bg-accent"
      : tone === "caution"
        ? "bg-caution"
        : tone === "neutral"
          ? "bg-muted"
          : "bg-verified";
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={cn(
          "absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-pulse-ring",
          color
        )}
      />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}
