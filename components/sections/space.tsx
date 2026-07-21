import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button, ArrowIcon } from "@/components/ui/button";

// "Space" — the trader community WITHIN the product. Kept secondary: the brand
// centres on Smart Risk Assistant, not on Space.
export function Space() {
  return (
    <section id="space" className="container-page py-8">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-br from-panel-2/90 to-panel/70 p-8 lg:p-12">
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <Badge tone="verified" className="mb-5">
                Inside the app
              </Badge>
              <h2 className="display text-[clamp(1.8rem,4vw,2.75rem)] text-text">
                Trade alongside a community in{" "}
                <span className="text-verified">Space</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                Discipline is easier with company. Space is the trader community
                built into Smart Risk Assistant — a place to share process,
                compare approaches to risk, and learn from how others think
                through their setups. It's one part of the app, not the whole
                story.
              </p>
              <div className="mt-7">
                <Button href="/download" variant="secondary">
                  Explore in the app <ArrowIcon />
                </Button>
              </div>
            </div>

            {/* Abstract community visual — code-built, no fake avatars/handles */}
            <div className="relative hidden h-52 lg:block">
              <div className="absolute inset-0 rounded-2xl border border-line bg-panel/50" />
              {[
                { top: "12%", left: "10%", size: "h-12 w-12", tone: "border-accent/40" },
                { top: "44%", left: "38%", size: "h-16 w-16", tone: "border-verified/40" },
                { top: "20%", left: "66%", size: "h-10 w-10", tone: "border-line-strong" },
                { top: "60%", left: "72%", size: "h-12 w-12", tone: "border-caution/40" },
                { top: "66%", left: "16%", size: "h-9 w-9", tone: "border-line-strong" },
              ].map((n, i) => (
                <span
                  key={i}
                  className={`absolute flex items-center justify-center rounded-full border bg-panel-2 ${n.size} ${n.tone}`}
                  style={{ top: n.top, left: n.left }}
                >
                  <span className="h-2 w-2 rounded-full bg-muted/50" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
