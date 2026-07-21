import Link from "next/link";
import { footerLinks, riskDisclaimer, site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-line bg-panel/40">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr,2fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              A protective layer between your trade idea and execution. Better
              risk control, better decisions, more disciplined trading.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <span className="eyebrow">{group}</span>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-text"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Risk disclaimer — required for a financial product. */}
        <div className="mt-14 rounded-2xl border border-line bg-panel/60 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-faint">
            Risk disclaimer
          </p>
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-muted">
            {riskDisclaimer}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-faint sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Not financial advice. Trade responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
