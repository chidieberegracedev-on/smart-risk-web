import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// A realistic CSS/SVG phone frame — bezel, side buttons, a soft device shadow,
// and a faint screen reflection. The screenshot sits inside, clipped to the
// screen's rounded corners. No external frame image needed.
// Screen aspect matches the real screenshots (720 × 1611).
export function PhoneFrame({
  children,
  className,
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={cn("relative mx-auto w-[300px] max-w-full", className)}>
      {glow && (
        <div className="absolute -inset-8 -z-10 rounded-[3.5rem] bg-accent/12 blur-3xl" />
      )}

      {/* side buttons */}
      <span className="absolute -left-[3px] top-[22%] h-16 w-[3px] rounded-l-full bg-line-strong" />
      <span className="absolute -right-[3px] top-[18%] h-10 w-[3px] rounded-r-full bg-line-strong" />
      <span className="absolute -right-[3px] top-[30%] h-16 w-[3px] rounded-r-full bg-line-strong" />

      {/* device body */}
      <div className="relative rounded-[2.7rem] border border-line-strong bg-gradient-to-b from-[#1c1c20] to-[#0c0c0f] p-[10px] shadow-[0_50px_130px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
        {/* screen */}
        <div className="relative aspect-[720/1611] overflow-hidden rounded-[2.1rem] bg-black">
          {children}
          {/* screen reflection */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(125deg,rgba(255,255,255,0.10),transparent_28%,transparent_72%,rgba(255,255,255,0.05))]" />
          {/* inner edge */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.1rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
        </div>
      </div>
    </div>
  );
}
