import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { features } from "@/lib/site";
import { FeatureIcon } from "@/components/ui/feature-icon";

export function FeaturesGrid({
  showHeading = true,
  limit,
}: {
  showHeading?: boolean;
  limit?: number;
}) {
  const list = limit ? features.slice(0, limit) : features;
  return (
    <section id="features" className="container-page py-24 lg:py-32">
      {showHeading && (
        <SectionHeading
          eyebrow="The ecosystem"
          title={
            <>
              Everything you need to trade{" "}
              <span className="text-gradient">deliberately</span>
            </>
          }
          intro="A connected set of tools — current and evolving — built around one idea: understand the risk before you take it."
          className="max-w-2xl"
        />
      )}

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <StaggerItem key={f.title}>
            <article className="group flex h-full flex-col rounded-2xl border border-line bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-panel-2/70">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-panel-2 text-accent transition-colors group-hover:border-accent/40">
                  <FeatureIcon name={f.title} />
                </span>
                <Badge
                  tone={
                    f.tag === "Core"
                      ? "accent"
                      : f.tag === "Evolving"
                        ? "caution"
                        : "neutral"
                  }
                >
                  {f.tag}
                </Badge>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-text">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
