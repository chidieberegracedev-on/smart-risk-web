import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button, ArrowIcon } from "@/components/ui/button";
import { Badge, Dot } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Advertise",
  description:
    "Reach a focused audience of active, risk-aware traders. The Smart Risk Assistant advertiser portal — campaign management and payments — is coming soon.",
};

const audience = [
  {
    title: "A focused, relevant audience",
    body: "Active traders using MetaTrader and following signals — people already spending on brokers, tools, and education.",
  },
  {
    title: "Context that fits",
    body: "Reach them inside a product they use to make trading decisions, not scattered across an unrelated feed.",
  },
  {
    title: "Honest placements only",
    body: "We hold advertisers to the same standard as ourselves: no guaranteed-profit claims, no misleading offers. Trust is the product.",
  },
];

const steps = [
  { n: "01", t: "Tell us your campaign", b: "Share what you're promoting and who you want to reach." },
  { n: "02", t: "Set budget & targeting", b: "Manage spend and audience from the advertiser portal (coming soon)." },
  { n: "03", t: "Reach the community", b: "Your message appears in relevant, clearly-marked placements." },
];

export default function AdvertisePage() {
  return (
    <>
      <PageHeader
        eyebrow="For businesses & creators"
        title={
          <>
            Reach traders who take{" "}
            <span className="text-gradient">risk seriously</span>
          </>
        }
        intro="Brokers, tool-makers, educators, and creators can promote to the Smart Risk Assistant community. A dedicated advertiser portal — with campaign management and payments — is on the way."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#waitlist" size="lg">
            Get early access <ArrowIcon />
          </Button>
          <Badge tone="caution">
            <Dot tone="caution" /> Portal in development
          </Badge>
        </div>
      </PageHeader>

      <section className="container-page py-16">
        <Stagger className="grid gap-4 md:grid-cols-3">
          {audience.map((a) => (
            <StaggerItem key={a.title}>
              <div className="h-full rounded-2xl border border-line bg-panel/60 p-7">
                <h3 className="text-lg font-semibold text-text">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {a.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          eyebrow="How advertising will work"
          title={
            <>
              Simple to launch,{" "}
              <span className="text-gradient">honest by default</span>
            </>
          }
          className="max-w-2xl"
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="h-full rounded-2xl border border-line bg-panel/60 p-7">
                <span className="data text-sm text-accent">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold text-text">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.b}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Portal CTA placeholder — links to the future authenticated section. */}
      <section id="waitlist" className="container-page py-16">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-br from-panel-2/90 to-panel/60 p-8 text-center lg:p-14">
            <div className="relative mx-auto max-w-2xl">
              <h2 className="display text-[clamp(1.9rem,4.5vw,3rem)] text-text">
                The advertiser portal is coming
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Self-serve campaign management and payments are in development.
                Register your interest and we'll reach out when early access
                opens.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  href="mailto:advertise@smartriskassistant.com?subject=Advertiser%20early%20access"
                  size="lg"
                >
                  Request early access <ArrowIcon />
                </Button>
                <Button href="/download" size="lg" variant="secondary">
                  See the product
                </Button>
              </div>
              <p className="mt-6 text-sm text-faint">
                A secure advertiser dashboard will live here — sign-in, campaign
                setup, and billing — built as the next phase.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
