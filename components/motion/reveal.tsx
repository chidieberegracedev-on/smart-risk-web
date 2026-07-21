"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  revealUp,
  revealFade,
  staggerParent,
  staggerChild,
  viewportOnce,
} from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: "up" | "fade";
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

// Single element that eases/fades in as it enters the viewport.
// prefers-reduced-motion is respected automatically by Framer (transforms
// collapse), and our global CSS neutralises transition durations too.
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  const variants = variant === "fade" ? revealFade : revealUp;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

// Parent that reveals its children in a deliberate staggered sequence.
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={staggerChild}>
      {children}
    </MotionTag>
  );
}
