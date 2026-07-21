"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The WebGL scene is heavy; load it only client-side, and only where it's
// worth it: wide viewports with motion allowed. Everywhere else we show a
// tasteful CSS orb so mobile battery/perf and reduced-motion users are safe.
const AegisScene = dynamic(() => import("./aegis-scene"), { ssr: false });

export function Hero3D() {
  const [enable3D, setEnable3D] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const wide = window.matchMedia("(min-width: 1024px)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const decide = () => setEnable3D(wide.matches && motionOk.matches);
    decide();
    wide.addEventListener("change", decide);
    motionOk.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      motionOk.removeEventListener("change", decide);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Full-bleed 3D scene, anchored toward the right so the orb sits behind
          the product console; the copy side stays clean and readable. */}
      {mounted && enable3D ? (
        <div className="absolute inset-y-[-10%] right-[-18%] left-[8%] lg:left-[30%]">
          <AegisScene />
        </div>
      ) : (
        <StaticOrb />
      )}
    </div>
  );
}

// CSS-only fallback orb — layered radial gradients + a conic sheen and a
// bright specular cap, echoing the WebGL orb. Used on mobile and under
// reduced-motion. Positioned so a clear glowing sphere reads on small screens.
function StaticOrb() {
  return (
    <div className="absolute inset-0">
      <div className="absolute right-[-32%] top-[26%] h-[min(86vw,560px)] w-[min(86vw,560px)] sm:right-[-18%] lg:right-[2%] lg:top-1/2 lg:h-[min(60vw,640px)] lg:w-[min(60vw,640px)] lg:-translate-y-1/2">
        {/* body */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_38%_28%,#28324a,#0b0b12_60%)] shadow-[inset_0_0_90px_rgba(0,0,0,0.85)]" />
        {/* specular cap */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_42%_16%,rgba(255,255,255,0.55),transparent_26%)] opacity-80" />
        {/* colored sheen */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_205deg,transparent,rgba(91,140,255,0.45),transparent_52%,rgba(63,185,127,0.3),transparent)] opacity-80 blur-[1px]" />
        {/* rim */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_2px_1px_rgba(126,162,255,0.35)]" />
        {/* inner glow */}
        <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_60%_65%,rgba(91,140,255,0.35),transparent_72%)] blur-md" />
        {/* ambient bloom */}
        <div className="absolute -inset-[12%] rounded-full bg-accent/15 blur-[90px]" />
      </div>
    </div>
  );
}
