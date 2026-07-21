"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { PhoneFrame } from "@/components/visuals/phone-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button, ArrowIcon } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/motion";

// Real app screenshots inside a device frame, with a scroll-synced screen swap
// on desktop (Option A) and a stacked reveal on mobile. Copy stays honest —
// clarity, risk control, discipline — no profit promises.
const screens = [
  {
    src: "/screenshots/home.jpg",
    eyebrow: "Home & Space",
    title: "Your trading world, the moment you open it",
    body: "Account balance, today's P&L, a daily discipline prompt, live market snapshots, and the Space community — the app opens on what keeps you grounded, not noise.",
    tone: "verified" as const,
  },
  {
    src: "/screenshots/market.jpg",
    eyebrow: "Markets",
    title: "Live prices across every pair, at a glance",
    body: "Forex, commodities, indices and more — scan the market and read the moves before you size a single position. Context first, action second.",
    tone: "accent" as const,
  },
  {
    src: "/screenshots/calculator.jpg",
    eyebrow: "Risk calculator",
    title: "Know the right lot. Manage your risk.",
    body: "Paste a signal or enter the setup — entry, stops, targets, account — and get the position size and risk before you commit. This is the core of the app.",
    tone: "accent" as const,
  },
];

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const onActive = useCallback((i: number) => setActive(i), []);

  return (
    <section id="the-app" className="relative py-24 lg:py-32">
      <div className="container-page lg:grid lg:grid-cols-2 lg:gap-20">
        {/* Left: heading + scrolling narrative */}
        <div>
          <SectionHeading
            eyebrow="See the app"
            title={
              <>
                The real product,{" "}
                <span className="text-gradient">in your hand</span>
              </>
            }
            intro="No mockups of features that don't exist — this is the actual app. Scroll through the three screens that matter most."
          />
          <div className="mt-6 lg:mt-2">
            {screens.map((s, i) => (
              <Step key={s.src} screen={s} index={i} onActive={onActive} />
            ))}
          </div>
        </div>

        {/* Right: sticky phone (desktop) — crossfades to the active screen */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneFrame>
                {screens.map((s, i) => (
                  <motion.img
                    key={s.src}
                    src={s.src}
                    alt={`${s.eyebrow} screen of the Smart Risk Assistant app`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={false}
                    animate={{ opacity: active === i ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                  />
                ))}
              </PhoneFrame>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-page">
        {/* CTA anchor */}
        <div className="mt-8 flex flex-col items-start gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-lg text-muted">
            Everything you just saw runs on Android today, in internal testing.
          </p>
          <Button href="/download" size="lg">
            Get the app <ArrowIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Step({
  screen,
  index,
  onActive,
}: {
  screen: (typeof screens)[number];
  index: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, margin: "-20% 0px -20% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div
      ref={ref}
      className="flex flex-col justify-center py-12 lg:min-h-[80vh] lg:py-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <Badge tone={screen.tone}>{screen.eyebrow}</Badge>
        <h3 className="display mt-5 text-[clamp(1.6rem,3.4vw,2.5rem)] leading-tight text-text">
          {screen.title}
        </h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          {screen.body}
        </p>

        {/* inline phone on mobile only */}
        <div className="mt-10 lg:hidden">
          <PhoneFrame>
            <img
              src={screen.src}
              alt={`${screen.eyebrow} screen of the Smart Risk Assistant app`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </PhoneFrame>
        </div>
      </motion.div>
    </div>
  );
}
