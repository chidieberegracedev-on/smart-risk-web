import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge, Dot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Learning resources for risk-first trading — position sizing, risk/reward, and trading psychology. A growing library inside Smart Risk Assistant.",
};

// Placeholder / "coming soon" shell — honest about what exists today.
const topics = [
  {
    title: "Position sizing fundamentals",
    body: "Why the size of a trade matters more than being right about direction.",
  },
  {
    title: "Reading risk & reward",
    body: "How to weigh what you stand to lose against what you stand to gain.",
  },
  {
    title: "Trading psychology & discipline",
    body: "Managing FOMO, revenge trades, and the emotional side of execution.",
  },
  {
    title: "Working with signals responsibly",
    body: "Turning a raw call into a plan with defined risk — instead of acting blind.",
  },
];

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title={
          <>
            Learn to think in{" "}
            <span className="text-gradient">risk</span>
          </>
        }
        intro="A practical library on risk-first trading is on the way — built to pair with the tools in the app. No get-rich shortcuts, just the fundamentals that keep traders in the game."
      >
        <Badge tone="verified">
          <Dot tone="verified" /> Library in development
        </Badge>
      </PageHeader>

      <section className="container-page py-16">
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <StaggerItem key={t.title}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-panel/60 p-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Coming soon</span>
                  <span className="data text-xs text-faint">—</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-panel-2/60 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-text">
                Want the lessons in context?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                For now, the best way to learn the workflow is to use it. The
                app walks you through sizing and risk on every trade.
              </p>
            </div>
            <Button href="/download" size="lg">
              Get the app
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
