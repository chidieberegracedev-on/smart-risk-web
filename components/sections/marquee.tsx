import { cn } from "@/lib/cn";

// A slow, seamless marquee of the discipline the product enforces. Uses a
// duplicated track + CSS transform (paused under reduced motion). Reads as a
// living "principles ribbon" between sections — a signature moving element.
const items = [
  "Size every position",
  "Know your risk",
  "Weigh the reward",
  "Score the setup",
  "Journal the trade",
  "Stay disciplined",
];

export function Marquee() {
  const track = [...items, ...items];
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-line bg-panel/30 py-6"
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

      <div className="flex w-max motion-safe:animate-marquee">
        {track.map((item, i) => (
          <div key={i} className="flex items-center">
            <span
              className={cn(
                "display whitespace-nowrap px-8 text-2xl font-medium sm:text-3xl",
                i % 2 === 0 ? "text-text/90" : "text-faint"
              )}
            >
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
          </div>
        ))}
      </div>
    </section>
  );
}
