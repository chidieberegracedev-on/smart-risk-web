import { cn } from "@/lib/cn";

// A quiet, static CSS echo of the hero's Aegis orb — used on interior page
// headers for visual continuity without the cost of running WebGL everywhere.
export function OrbEcho({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-[-14%] top-[-30%] h-[min(46vw,440px)] w-[min(46vw,440px)] opacity-70 lg:right-[-4%]",
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_38%_30%,#232c42,#0b0b12_62%)] shadow-[inset_0_0_70px_rgba(0,0,0,0.85)]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_44%_18%,rgba(255,255,255,0.4),transparent_24%)] opacity-70" />
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_205deg,transparent,rgba(91,140,255,0.35),transparent_54%,rgba(63,185,127,0.22),transparent)] opacity-70 blur-[1px]" />
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_2px_1px_rgba(126,162,255,0.28)]" />
      <div className="absolute -inset-[14%] rounded-full bg-accent/10 blur-[90px]" />
    </div>
  );
}
