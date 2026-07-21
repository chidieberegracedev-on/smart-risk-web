"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

// Word-by-word mask reveal — each word sits in an overflow-hidden clip and
// rises into place. This is the signature "cinematic" heading motion.
// The real words remain in the DOM as text, so it stays accessible and the
// reduced-motion global rule collapses the transform to an instant reveal.

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  // Highlight specific words (by lowercased match) with the gradient treatment.
  highlight?: string[];
  once?: boolean;
  animateOnMount?: boolean;
};

export function TextReveal({
  text,
  className,
  as = "h2",
  delay = 0,
  stagger = 0.045,
  highlight = [],
  once = true,
  animateOnMount = false,
}: Props) {
  const words = text.split(" ");
  const MotionTag = motion[as];
  const hi = new Set(highlight.map((w) => w.toLowerCase()));

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const child = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: 0.85, ease: EASE_OUT },
    },
  };

  const animationProps = animateOnMount
    ? { initial: "hidden" as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once, amount: 0.5 } as const,
      };

  return (
    <MotionTag className={className} variants={container} {...animationProps}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,—]/g, "").toLowerCase();
        const isHi = hi.has(clean);
        return (
          <span
            key={`${word}-${i}`}
            className="inline-flex overflow-hidden pb-[0.12em] align-bottom"
            style={{ marginRight: "0.24em" }}
          >
            <motion.span
              variants={child}
              className={isHi ? "text-gradient inline-block" : "inline-block"}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
