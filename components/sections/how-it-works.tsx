"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { steps } from "@/lib/site";
import { cn } from "@/lib/cn";

// Scroll-linked "protective layer" stepper. As you scroll through the section,
// a progress line fills and each step activates in sequence. On mobile it
// stacks; the sticky column only engages at lg+ where there's room.
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  return (
    <section className="relative border-y border-line bg-panel/30 py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              A protective layer, in{" "}
              <span className="text-gradient">three steps</span>
            </>
          }
          intro="Signal or idea, in. Risk analysis, applied. Disciplined execution, out. The same loop every time you trade."
          className="max-w-2xl"
        />

        <div ref={ref} className="mt-16 grid gap-10 lg:grid-cols-[1fr,1.1fr]">
          {/* Steps with progress rail */}
          <div className="relative">
            {/* Rail */}
            <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-line" />
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-accent to-verified"
            />

            <div className="flex flex-col gap-10">
              {steps.map((step, i) => (
                <Step key={step.n} step={step} index={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>

          {/* Sticky visual explainer */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <FlowDiagram progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each step "activates" as scroll passes its threshold.
  const start = index / steps.length;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.12), start + 0.05],
    [0.4, 1]
  );
  const dotColor = useTransform(
    progress,
    [Math.max(0, start - 0.12), start + 0.05],
    ["#33333A", "#5B8CFF"]
  );

  return (
    <motion.div style={{ opacity }} className="relative pl-14">
      <motion.span
        style={{ backgroundColor: dotColor }}
        className="absolute left-[11px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-bg"
      />
      <span className="data text-sm text-accent">{step.n}</span>
      <h3 className="mt-1 text-xl font-semibold text-text">{step.title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        {step.body}
      </p>
    </motion.div>
  );
}

// Abstract flow: IDEA -> RISK ENGINE -> EXECUTION, with a token travelling.
function FlowDiagram({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const tokenY = useTransform(progress, [0, 1], ["4%", "88%"]);
  const nodes = [
    { label: "Idea / signal", tone: "text-muted", ring: "border-line-strong" },
    { label: "Risk analysis", tone: "text-accent", ring: "border-accent/50" },
    { label: "Disciplined execution", tone: "text-verified", ring: "border-verified/50" },
  ];
  return (
    <div className="grain relative overflow-hidden rounded-3xl border border-line-strong bg-panel-2/80 p-8">
      <div className="relative flex flex-col gap-6">
        {/* travelling token */}
        <motion.div
          style={{ top: tokenY }}
          className="absolute left-[-6px] h-3 w-3 rounded-full bg-accent shadow-[0_0_16px_4px_rgba(91,140,255,0.6)]"
        />
        <div className="absolute bottom-2 left-0 top-2 w-px bg-gradient-to-b from-line via-accent/40 to-verified/40" />

        {nodes.map((n) => (
          <div
            key={n.label}
            className={cn(
              "ml-6 rounded-2xl border bg-panel/70 p-5",
              n.ring
            )}
          >
            <p className={cn("text-sm font-semibold", n.tone)}>{n.label}</p>
            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 flex-1 rounded-full bg-line-strong"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[11px] text-faint">
        The loop runs every trade — not just the ones that go wrong.
      </p>
    </div>
  );
}
