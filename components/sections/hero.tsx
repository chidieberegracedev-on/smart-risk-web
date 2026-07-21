"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { Hero3D } from "@/components/visuals/hero-3d";
import { RiskConsole } from "@/components/visuals/risk-console";
import { Button, ArrowIcon } from "@/components/ui/button";
import { Badge, Dot } from "@/components/ui/badge";
import { Magnetic } from "@/components/ui/magnetic";
import { TextReveal } from "@/components/motion/text-reveal";
import { EASE_OUT } from "@/lib/motion";

const capabilities = [
  "MetaTrader",
  "Telegram signals",
  "Position sizing",
  "Risk / reward",
  "Setup scoring",
  "Trade journal",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40"
    >
      <motion.div style={{ y: meshY }} className="absolute inset-0">
        <GradientMesh />
      </motion.div>

      {/* Full-bleed 3D Aegis scene */}
      <motion.div style={{ y: meshY }} className="absolute inset-0">
        <Hero3D />
      </motion.div>

      {/* Legibility scrim — keeps the copy side readable over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0A0A0A_0%,rgba(10,10,10,0.82)_34%,rgba(10,10,10,0.15)_62%,rgba(10,10,10,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.08fr,0.92fr]">
        {/* Copy */}
        <motion.div style={{ y: copyY }} className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <Badge tone="accent" className="mb-7">
              <Dot tone="accent" /> For MetaTrader &amp; signal traders
            </Badge>
          </motion.div>

          {/* Oversized, dominant display headline with word-mask reveal */}
          <h1 className="display text-[clamp(3rem,8.2vw,6.75rem)] leading-[0.92] text-text">
            <TextReveal
              as="span"
              text="Trade with a risk framework."
              highlight={["risk", "framework"]}
              animateOnMount
              className="block"
            />
            <TextReveal
              as="span"
              text="Not on impulse."
              animateOnMount
              delay={0.28}
              className="block text-faint"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.55 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
          >
            Smart Risk Assistant sits between your idea and your execution —
            calculating position size, weighing risk against reward, and scoring
            your setups, so every trade has a plan before it has your money.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.68 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Button href="/download" size="lg">
                Get the app <ArrowIcon />
              </Button>
            </Magnetic>
            <Button href="/how-it-works" size="lg" variant="secondary">
              See how it works
            </Button>
          </motion.div>

          {/* Capability ticker — quiet, technical, "alive" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {capabilities.map((c) => (
              <span
                key={c}
                className="data flex items-center gap-2 text-xs text-faint"
              >
                <span className="h-1 w-1 rounded-full bg-accent/70" />
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Product visual with a strong ambient glow behind it */}
        <motion.div
          style={{ y: visualY }}
          className="relative flex justify-center lg:justify-end"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
          />
          <div className="relative">
            <RiskConsole />
          </div>
        </motion.div>
      </div>

      {/* Transformation strip: FROM -> TO */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: EASE_OUT }}
        className="container-page relative mt-20 lg:mt-28"
      >
        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-line bg-panel/50 p-2 backdrop-blur-sm sm:flex-row sm:items-center">
          <div className="flex-1 rounded-xl px-5 py-4">
            <span className="eyebrow">From</span>
            <p className="mt-1 text-[15px] text-muted">
              “I have a trade idea or a signal.”
            </p>
          </div>
          <div className="flex items-center justify-center px-2 text-accent">
            <ArrowIcon className="rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 rounded-xl bg-panel-2/80 px-5 py-4">
            <span className="eyebrow text-accent">To</span>
            <p className="mt-1 text-[15px] text-text">
              “I know the risk, size, and plan before I enter.”
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
