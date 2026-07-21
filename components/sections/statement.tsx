"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";

// The signature editorial moment: an oversized statement whose words brighten
// one-by-one as you scroll through it (the "fill-in" effect seen on premium
// product sites). Grounded in the risk-first message — no profit claim.
const STATEMENT =
  "You can't predict the next candle. But you can decide exactly what a trade is allowed to cost you — before you take it. That decision, made the same way every time, is the edge.";

const highlightWords = new Set(["risk", "decision", "edge.", "cost"]);

export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section className="relative overflow-hidden py-28 lg:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[70vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />
      <div ref={ref} className="container-page relative max-w-5xl">
        <Reveal>
          <span className="eyebrow">The core idea</span>
        </Reveal>
        <p className="display mt-8 text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[1.12] tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[start, end]}
                highlight={highlightWords.has(word.toLowerCase())}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="relative mr-[0.22em] inline-block">
      {/* faint base so the sentence is always legible (and for reduced motion) */}
      <span className="absolute inset-0 text-faint/25">{children}</span>
      <motion.span
        style={{ opacity }}
        className={highlight ? "text-gradient" : "text-text"}
      >
        {children}
      </motion.span>
    </span>
  );
}
