import type { ReactNode } from "react";
import { GradientMesh } from "@/components/visuals/gradient-mesh";
import { OrbEcho } from "@/components/visuals/orb-echo";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-8 pt-32 lg:pt-40">
      <GradientMesh intensity="soft" />
      <OrbEcho />
      <div className="container-page relative max-w-4xl">
        <Reveal>
          <Badge tone="accent">{eyebrow}</Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display mt-6 text-[clamp(2.4rem,6vw,4.25rem)] text-text">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {intro}
          </p>
        </Reveal>
        {children && (
          <Reveal delay={0.15}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
