import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { CTA } from "@/components/sections/cta";
import { RiskConsole } from "@/components/visuals/risk-console";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the Smart Risk Assistant toolkit: risk & lot-size calculation, setup analysis, risk/reward evaluation, trade quality scoring, journaling, and AI-assisted analysis — all built around risk control.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        title={
          <>
            A toolkit for{" "}
            <span className="text-gradient">disciplined</span> trading
          </>
        }
        intro="Each tool answers one question before you enter a trade: what am I really risking, and is this setup worth it? Here's the full ecosystem — the pieces available today and the ones actively evolving."
      />

      {/* Deep-dive: the calculator, shown as the anchor feature */}
      <section className="container-page py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr,0.9fr]">
          <div className="order-2 lg:order-1">
            <SectionHeading
              eyebrow="Anchor tool"
              title={
                <>
                  Position sizing, calculated —{" "}
                  <span className="text-gradient">never guessed</span>
                </>
              }
              intro="Enter your account size, the percentage you're willing to risk, and your stop distance. Get the exact lot size instantly, with the risk-to-reward and a quality score alongside it — so the whole picture is in front of you before you commit."
            />
            <ul className="mt-8 flex flex-col gap-3">
              {[
                "Precise lot size from your real account and stop",
                "Risk expressed as a share of your account, not a vague feeling",
                "Risk/reward and setup score in the same view",
                "A behavioural nudge when a trade breaks your own rules",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-[15px] leading-relaxed text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <RiskConsole />
          </Reveal>
        </div>
      </section>

      <FeaturesGrid showHeading />
      <CTA
        title="Put the whole toolkit in your pocket."
        subtitle="Every tool is designed to make the risk visible before the trade. Start free on Android."
      />
    </>
  );
}
