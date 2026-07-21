import { cn } from "@/lib/cn";

// Code-built cinematic background: slow-drifting colour blobs behind a faint
// grid, under a grain overlay. No stock imagery — the atmosphere is all CSS.
// Blobs use the restrained palette (blue primary, faint green/amber accents).
export function GradientMesh({
  className,
  intensity = "hero",
}: {
  className?: string;
  intensity?: "hero" | "soft";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Faint grid */}
      <div className="absolute inset-0 bg-grid-faint [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />

      {/* Drifting mesh blobs */}
      <div
        className={cn(
          "absolute -left-[10%] top-[-15%] h-[55vh] w-[55vh] rounded-full blur-[110px] motion-safe:animate-mesh-drift",
          intensity === "hero" ? "opacity-60" : "opacity-30"
        )}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(91,140,255,0.55), transparent 70%)",
        }}
      />
      <div
        className={cn(
          "absolute right-[-8%] top-[8%] h-[42vh] w-[42vh] rounded-full blur-[120px] motion-safe:animate-mesh-drift-2",
          intensity === "hero" ? "opacity-45" : "opacity-20"
        )}
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(63,185,127,0.28), transparent 70%)",
        }}
      />
      <div
        className={cn(
          "absolute bottom-[-20%] left-[35%] h-[46vh] w-[46vh] rounded-full blur-[130px] motion-safe:animate-mesh-drift",
          intensity === "hero" ? "opacity-35" : "opacity-15"
        )}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(224,166,60,0.18), transparent 70%)",
        }}
      />

      {/* Vignette + fade to page background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0A0A_92%)]" />
    </div>
  );
}
