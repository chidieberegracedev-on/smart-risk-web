import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button, ArrowIcon } from "@/components/ui/button";
import { Badge, Dot } from "@/components/ui/badge";
import { RiskConsole } from "@/components/visuals/risk-console";

export const metadata: Metadata = {
  title: "Get the app",
  description:
    "Get Smart Risk Assistant on Android. Currently in Play Store internal testing — join the testing program to start trading with a risk framework.",
};

const whatYouGet = [
  "The risk & lot-size calculator on every trade",
  "Risk/reward and setup quality scoring",
  "A trading journal that tracks your process",
  "Behavioural nudges that keep you disciplined",
];

export default function DownloadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get the app"
        title={
          <>
            Start trading with a{" "}
            <span className="text-gradient">risk framework</span>
          </>
        }
        intro="Smart Risk Assistant is available on Android through Play Store internal testing while we prepare for a wider release. Join the testing program to get started today."
      >
        <Badge tone="verified">
          <Dot tone="verified" /> Android · internal testing
        </Badge>
      </PageHeader>

      <section className="container-page py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr,0.9fr]">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Placeholder store link — swap for the public Play Store URL later. */}
              <Button
                href="https://play.google.com/store"
                size="lg"
                ariaLabel="Join Android internal testing on Google Play"
              >
                <GooglePlayGlyph /> Join Android testing
              </Button>
              <Button href="/how-it-works" size="lg" variant="secondary">
                See how it works
              </Button>
            </div>

            <p className="mt-5 text-sm text-faint">
              iOS is planned. The store link above is a placeholder for the
              internal-testing program while distribution is finalised.
            </p>

            <ul className="mt-10 flex flex-col gap-3">
              {whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-verified/30 text-verified">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3.5 8.5l2.8 2.8L12.5 5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-relaxed text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="flex justify-center lg:justify-end">
            <RiskConsole />
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <div className="rounded-2xl border border-caution/25 bg-caution/[0.05] p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-caution">
              Before you start
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Trading involves substantial risk of loss. Smart Risk Assistant is
              a decision-support and risk-management tool — not financial advice,
              a signal service, or a guarantee of any result. Use it to inform
              your own decisions, and never risk capital you can't afford to
              lose.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function GooglePlayGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.2v11.6c0 .35.38.56.68.38l9.9-5.8a.44.44 0 000-.76L3.18 1.82a.44.44 0 00-.68.38Z"
        fill="currentColor"
      />
    </svg>
  );
}
