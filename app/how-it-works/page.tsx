import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CTA } from "@/components/sections/cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "The risk-first workflow: bring an idea or signal, run the risk analysis (position size, risk/reward, setup score), then execute with discipline and journal the result.",
};

const principles = [
  {
    title: "A layer, not a replacement",
    body: "Smart Risk Assistant doesn't trade for you or tell you what to buy. It sits between your idea and your execution and makes the risk explicit.",
  },
  {
    title: "The same loop, every time",
    body: "Consistency is the point. Running the same risk check on every trade is what turns scattered results into a process you can measure and improve.",
  },
  {
    title: "Your judgement, sharpened",
    body: "The scores and calculations are inputs to your decision — a second set of eyes on the numbers, never a command to act.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={
          <>
            From a signal to a{" "}
            <span className="text-gradient">plan you can trust</span>
          </>
        }
        intro="The workflow is deliberately simple, because it has to survive real trading conditions — mobile, mid-session, with a signal ticking. Idea in, risk applied, disciplined execution out."
      />

      <HowItWorks />

      <section className="container-page py-24 lg:py-32">
        <SectionHeading
          eyebrow="The philosophy"
          title={
            <>
              Why a protective{" "}
              <span className="text-gradient">layer</span> works
            </>
          }
          intro="Good trades still lose and bad trades still win. What you can control is how much you risk and how consistently you decide — that's where this fits."
          className="max-w-2xl"
        />
        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <StaggerItem key={p.title}>
              <div className="h-full rounded-2xl border border-line bg-panel/60 p-7">
                <span className="data text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-text">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CTA
        title="Make the risk check a habit."
        subtitle="The traders who last aren't the ones who are always right — they're the ones who manage risk the same way every time."
      />
    </>
  );
}
