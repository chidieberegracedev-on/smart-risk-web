import Link from "next/link";

// Honest placeholder for sections that ship in the next build phase — a real
// state, not a fake screen.
export function PhaseStub({ title, body }: { title: string; body: string }) {
  return (
    <section className="mx-auto max-w-xl rounded-2xl bg-portal-surface p-10 text-center shadow-portal-soft">
      <h2 className="text-xl font-semibold text-portal-text">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-portal-muted">{body}</p>
      <Link href="/portal" className="mt-6 inline-flex text-sm text-portal-accent hover:underline">
        Back to Overview
      </Link>
    </section>
  );
}
