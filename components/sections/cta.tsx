import { Reveal } from "@/components/motion/reveal";
import { Button, ArrowIcon } from "@/components/ui/button";
import { GradientMesh } from "@/components/visuals/gradient-mesh";

export function CTA({
  title = "Enter your next trade with a plan.",
  subtitle = "Bring your idea. Run the risk check. Execute with discipline. Smart Risk Assistant is free to start on Android.",
  primaryLabel = "Get the app",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="container-page py-16">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-3xl border border-line-strong bg-panel/50 px-6 py-16 text-center sm:px-12 lg:py-24">
          <GradientMesh intensity="soft" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <h2 className="display text-[clamp(2rem,5vw,3.5rem)] text-text">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/download" size="lg">
                {primaryLabel} <ArrowIcon />
              </Button>
              <Button href="/features" size="lg" variant="secondary">
                Explore features
              </Button>
            </div>
            <p className="mt-6 text-sm text-faint">
              Trading involves risk of loss. A tool for risk management, not
              financial advice.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
