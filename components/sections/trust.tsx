import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

// Honest credibility — principles we hold, NOT fake stats, testimonials, or
// invented user counts. This is what earns trust for a financial tool.
const principles = [
  {
    title: "Risk-first, always",
    body: "Every feature starts from the same question: what are you risking, and is it worth it? We never frame trading as a path to guaranteed gains.",
  },
  {
    title: "No signals, no predictions",
    body: "We don't sell calls or claim to know where the market is going. The tools sharpen your judgement — the decision stays yours.",
  },
  {
    title: "Honest by design",
    body: "No hype, no “100% accurate”, no invented track records. Restraint is what separates a real tool from a scam.",
  },
  {
    title: "Built for real workflows",
    body: "Designed around how traders actually work — MetaTrader, signals from communities, and their own analysis — not a walled garden.",
  },
];

export function Trust() {
  return (
    <section className="container-page py-24 lg:py-32">
      <SectionHeading
        eyebrow="Why trust it"
        title={
          <>
            Credibility comes from{" "}
            <span className="text-gradient">restraint</span>
          </>
        }
        intro="We're early and honest about it. Instead of fake numbers, here's what we actually stand for — the standard we hold every feature to."
        align="center"
        className="mx-auto"
      />

      <Stagger className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <StaggerItem key={p.title}>
            <div className="flex h-full gap-4 rounded-2xl border border-line bg-panel/60 p-6">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-verified/30 text-verified">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.5l2.8 2.8L12.5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-text">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
