import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Problem } from "@/components/sections/problem";
import { Statement } from "@/components/sections/statement";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FeaturesGrid } from "@/components/sections/features-grid";
import { Space } from "@/components/sections/space";
import { Trust } from "@/components/sections/trust";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Problem />
      <Statement />
      <HowItWorks />
      <FeaturesGrid />
      <Space />
      <Trust />
      <CTA />
    </>
  );
}
