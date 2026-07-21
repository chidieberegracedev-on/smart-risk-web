"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { RiskConsole } from "@/components/visuals/risk-console";
import { Button, ArrowIcon } from "@/components/ui/button";
import { Badge, Dot } from "@/components/ui/badge";
import { EASE_OUT, staggerParent, staggerChild } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Subtle scroll-linked parallax on the visual side.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-28 lg:pt-40"
    >
      <motion.div style={{ y: meshY }} className="absolute inset-0">
        <GradientMesh />
      </motion.div>

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.05fr,0.95fr]">
        {/* Copy */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start"
        >
          <motion.div variants={staggerChild}>
            <Badge tone="accent" className="mb-6">
              <Dot tone="accent" /> For MetaTrader &amp; signal traders
            </Badge>
          </motion.div>

          <motion.h1
            variants={staggerChild}
            className="display text-[clamp(2.6rem,6.5vw,5rem)] text-text"
          >
            Trade with a{" "}
            <span className="text-gradient">risk framework</span>,
            <br className="hidden sm:block" /> not on impulse.
          </motion.h1>

          <motion.p
            variants={staggerChild}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Smart Risk Assistant sits between your idea and your execution.
            Calculate position sizes, weigh risk against reward, and score your
            setups — so every trade has a plan before it has your money.
          </motion.p>

          <motion.div
            variants={staggerChild}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="/download" size="lg">
              Get the app <ArrowIcon />
            </Button>
            <Button href="/how-it-works" size="lg" variant="secondary">
              See how it works
            </Button>
          </motion.div>

          <motion.p
            variants={staggerChild}
            className="mt-6 text-sm text-faint"
          >
            A tool for risk management and better decisions — never a signal
            service or a promise of profit.
          </motion.p>
        </motion.div>

        {/* Product visual */}
        <motion.div
          style={{ y: visualY }}
          className="flex justify-center lg:justify-end"
        >
          <RiskConsole />
        </motion.div>
      </div>

      {/* Transformation strip: FROM -> TO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT }}
        className="container-page relative mt-16 lg:mt-24"
      >
        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-line bg-panel/50 p-2 sm:flex-row sm:items-center">
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
