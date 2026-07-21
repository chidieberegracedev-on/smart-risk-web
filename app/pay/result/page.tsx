import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ResultPoller } from "./result-poller";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false, follow: false },
};

// Lands here after provider checkout. A server component reads the session id
// from searchParams (avoids a useSearchParams suspense boundary) and hands it
// to the client poller, which waits for the webhook's effect.
export default function PayResultPage({
  searchParams,
}: {
  searchParams: { session?: string };
}) {
  const sessionId =
    typeof searchParams.session === "string" && searchParams.session.length > 0
      ? searchParams.session
      : null;

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 pb-16 pt-28">
      <div className="mb-8">
        <Link href="/" aria-label="Smart Risk Assistant home">
          <Logo />
        </Link>
      </div>
      <ResultPoller sessionId={sessionId} />
    </section>
  );
}
