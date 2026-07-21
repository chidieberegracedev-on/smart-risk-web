import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GradientMesh } from "@/components/visuals/gradient-mesh";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-24">
      <GradientMesh intensity="soft" />
      <div className="container-page relative text-center">
        <p className="data text-sm text-accent">404</p>
        <h1 className="display mt-4 text-[clamp(2.2rem,6vw,4rem)] text-text">
          This page took an exit we didn't plan for.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          The link may be broken or the page may have moved. Let's get you back
          to safer ground.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Page not found",
};
