import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { problems } from "@/lib/site";

export function Problem() {
  return (
    <section className="container-page py-24 lg:py-32">
      <SectionHeading
        eyebrow="The real problem"
        title={
          <>
            Most traders know <span className="text-muted">where</span> to
            trade. They lose on <span className="text-gradient">how</span>.
          </>
        }
        intro="The chart isn't usually the problem. Blown accounts trace back to risking too much, miscalculating size, and entering on emotion — the execution, not the idea."
        className="max-w-3xl"
      />

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2">
        {problems.map((p, i) => (
          <StaggerItem key={p.title}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-panel/60 p-6 transition-colors duration-300 hover:border-line-strong">
              <span className="data text-sm text-faint">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-text">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {p.body}
              </p>
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-danger/[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-100 sm:opacity-0" />
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-8">
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          A repeatable risk framework turns trading from a series of guesses
          into a process you can actually improve.
        </p>
      </Reveal>
    </section>
  );
}
