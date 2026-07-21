import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

// iPhone-17-style device frame: thin uniform bezel, a titanium edge, a
// Dynamic Island, and a soft screen glare. The screenshot sits inside, clipped
// to the screen's rounded corners. Screen aspect matches the real screenshots
// (720 × 1611). No external frame image needed.
export function PhoneFrame({
  children,
  className,
  width,
  glow = true,
  glare = true,
  island = true,
}: {
  children: ReactNode;
  className?: string;
  /** Overrides the default 300px width (number = px, or any CSS length). */
  width?: number | string;
  glow?: boolean;
  glare?: boolean;
  island?: boolean;
}) {
  const style: CSSProperties | undefined =
    width !== undefined ? { width } : undefined;

  return (
    <div
      className={cn("relative mx-auto w-[300px] max-w-full", className)}
      style={style}
    >
      {glow && (
        <div className="absolute -inset-8 -z-10 rounded-[3.6rem] bg-accent/12 blur-3xl" />
      )}

      {/* titanium edge */}
      <div className="relative rounded-[2.75rem] bg-gradient-to-b from-[#4a4a52] via-[#17171b] to-[#33333b] p-[2px] shadow-[0_50px_130px_-30px_rgba(0,0,0,0.95)]">
        {/* thin black bezel */}
        <div className="relative rounded-[2.65rem] bg-black p-[4px]">
          {/* screen */}
          <div className="relative aspect-[720/1611] overflow-hidden rounded-[2.35rem] bg-black">
            {children}

            {/* Dynamic Island */}
            {island && (
              <div className="absolute left-1/2 top-[9px] z-30 flex h-[19px] w-[84px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#0a1626] shadow-[inset_0_0_0_1px_rgba(120,150,255,0.25)]" />
              </div>
            )}

            {/* soft glare + inner edge */}
            {glare && (
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(125deg,rgba(255,255,255,0.16),transparent_26%,transparent_74%,rgba(255,255,255,0.06))]" />
            )}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.35rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
          </div>
        </div>
      </div>

      {/* side buttons */}
      <span className="absolute -left-[2px] top-[23%] h-14 w-[2px] rounded-l bg-[#41414a]" />
      <span className="absolute -right-[2px] top-[19%] h-9 w-[2px] rounded-r bg-[#41414a]" />
      <span className="absolute -right-[2px] top-[30%] h-14 w-[2px] rounded-r bg-[#41414a]" />
    </div>
  );
}
