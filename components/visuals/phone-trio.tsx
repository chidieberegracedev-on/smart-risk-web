"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { PhoneFrame } from "@/components/visuals/phone-frame";
import { EASE_OUT } from "@/lib/motion";

// A fanned trio: the calculator (the core tool) sits centre-front, with the
// home and market screens slanted behind it, left and right. The whole group
// tilts toward the cursor and reveals with a staggered entrance on scroll.

type Placed = {
  src: string;
  alt: string;
  // 3D placement within the fixed design canvas
  transform: string;
  z: string;
  width: number;
  dim?: boolean;
  delay: number;
};

const phones: Placed[] = [
  {
    src: "/screenshots/home.jpg",
    alt: "Home and Space community screen",
    transform:
      "translate(-50%,-50%) translateX(-152px) translateZ(-150px) rotateY(30deg) scale(0.92)",
    z: "z-10",
    width: 220,
    dim: true,
    delay: 0.12,
  },
  {
    src: "/screenshots/market.jpg",
    alt: "Live markets screen",
    transform:
      "translate(-50%,-50%) translateX(152px) translateZ(-150px) rotateY(-30deg) scale(0.92)",
    z: "z-10",
    width: 220,
    dim: true,
    delay: 0.18,
  },
  {
    src: "/screenshots/calculator.jpg",
    alt: "Risk calculator screen",
    transform: "translate(-50%,-50%) translateZ(10px)",
    z: "z-20",
    width: 244,
    delay: 0,
  },
];

export function PhoneTrio() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [12, -12]), {
    stiffness: 110,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-7, 7]), {
    stiffness: 110,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative mx-auto h-[380px] w-full sm:h-[460px] lg:h-[540px]"
      style={{ perspective: 1500 }}
    >
      {/* ambient glow pool */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[110px]" />

      {/* responsive scale wrapper (keeps 3D transform separate from mouse tilt) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="scale-[0.62] sm:scale-[0.82] lg:scale-100">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative h-[540px] w-[540px]"
          >
            {phones.map((p) => (
              <div
                key={p.src}
                className={`absolute left-1/2 top-1/2 ${p.z}`}
                style={{ transform: p.transform, transformStyle: "preserve-3d" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: p.delay }}
                >
                  <PhoneFrame width={p.width} glow={false}>
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {p.dim && (
                      <div className="pointer-events-none absolute inset-0 z-10 bg-black/35" />
                    )}
                  </PhoneFrame>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
