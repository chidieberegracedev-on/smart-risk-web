"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./auth-context";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "@/components/ui/logo";
import { signOutUser } from "@/lib/firebase-client";
import { cn } from "@/lib/cn";

// Portal chrome: collapsible sidebar + topbar, themed via portal CSS vars so
// Dark / Light / System all share these components. Auth guard lives here.

const sections = [
  { href: "/portal", label: "Overview", icon: IconGrid },
  { href: "/portal/campaigns", label: "Campaigns", icon: IconLayers },
  { href: "/portal/create", label: "Create Promotion", icon: IconPlus },
  { href: "/portal/analytics", label: "Analytics", icon: IconChart },
  { href: "/portal/verification", label: "Verification", icon: IconShield },
  { href: "/portal/billing", label: "Billing", icon: IconCard },
  { href: "/portal/settings", label: "Settings", icon: IconGear },
];

export function PortalShell({ children }: { children: ReactNode }) {
  const { user, loading, configured, preview } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Guard: configured + resolved + signed out → /login.
  useEffect(() => {
    if (configured && !loading && !user) router.replace("/login");
  }, [configured, loading, user, router]);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (!configured && !preview) {
    return (
      <CenterNote
        title="The portal isn't configured yet"
        body="Authentication hasn't been set up on this environment. Add the Firebase configuration to enable sign-in."
      />
    );
  }
  if (configured && (loading || !user)) {
    return (
      <CenterNote title="One moment…" body="Checking your session." spinner />
    );
  }

  const title =
    sections.find(
      (s) => pathname === s.href || (s.href !== "/portal" && pathname.startsWith(s.href))
    )?.label ?? "Portal";

  return (
    <div className="flex min-h-screen bg-portal-bg text-portal-text">
      {/* Sidebar (desktop) */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-portal-line bg-portal-surface transition-[width] duration-300 lg:flex",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        <div className={cn("flex h-16 items-center", collapsed ? "justify-center" : "px-5")}>
          <Link href="/" aria-label="Smart Risk Assistant home">
            <Logo showWord={!collapsed} wordClassName="text-portal-text" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {sections.map((s) => (
            <SidebarLink key={s.href} section={s} pathname={pathname} collapsed={collapsed} />
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="m-3 flex h-9 cursor-pointer items-center justify-center rounded-lg text-portal-faint transition-colors hover:bg-portal-elevated hover:text-portal-text"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            className={cn("transition-transform", collapsed && "rotate-180")}>
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-portal-line bg-portal-bg/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-portal-text lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className="text-[17px] font-semibold">{title}</h1>
            {preview && (
              <span className="rounded-full bg-portal-pending/15 px-2.5 py-1 text-[11px] font-medium text-portal-pending">
                Preview mode — sample data
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu email={user?.email ?? (preview ? "preview@demo" : null)} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-portal-line bg-portal-surface lg:hidden"
            >
              <div className="flex h-16 items-center px-5">
                <Logo wordClassName="text-portal-text" />
              </div>
              <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
                {sections.map((s) => (
                  <SidebarLink key={s.href} section={s} pathname={pathname} collapsed={false} />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({
  section,
  pathname,
  collapsed,
}: {
  section: (typeof sections)[number];
  pathname: string;
  collapsed: boolean;
}) {
  const active =
    pathname === section.href ||
    (section.href !== "/portal" && pathname.startsWith(section.href));
  const Icon = section.icon;
  return (
    <Link
      href={section.href}
      title={collapsed ? section.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-portal-elevated font-medium text-portal-text"
          : "text-portal-muted hover:bg-portal-elevated/60 hover:text-portal-text"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-portal-accent" : "")} />
      {!collapsed && section.label}
    </Link>
  );
}

function UserMenu({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-portal-elevated text-sm font-semibold text-portal-text"
      >
        {(email?.[0] ?? "A").toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-portal-line bg-portal-surface p-2 shadow-portal-soft">
          <p className="truncate px-3 py-2 text-xs text-portal-muted">{email ?? "Signed in"}</p>
          <button
            type="button"
            onClick={async () => {
              try { await signOutUser(); } catch { /* not configured in preview */ }
              router.replace("/");
            }}
            className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm text-portal-text transition-colors hover:bg-portal-elevated"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function CenterNote({ title, body, spinner }: { title: string; body: string; spinner?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-portal-bg px-6 text-center">
      <div>
        {spinner && (
          <motion.span
            className="mx-auto mb-5 block h-8 w-8 rounded-full border-2 border-portal-line border-t-portal-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        )}
        <h1 className="text-xl font-semibold text-portal-text">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-portal-muted">{body}</p>
      </div>
    </div>
  );
}

/* ── icons: 18px, 1.5 stroke ── */
type IconProps = { className?: string };
function IconGrid({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconLayers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="m9 2 7 3.5L9 9 2 5.5 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m2 9.5 7 3.5 7-3.5M2 13l7 3.5 7-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconChart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 15.5v-13M2.5 15.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m5 11 3-3.5 2.5 2L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M9 1.8 15 4v4.6c0 4-2.7 6.4-6 7.9-3.3-1.5-6-3.9-6-7.9V4l6-2.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m6.3 9 1.9 1.9 3.5-3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7.5h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconGear({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 1.8v2M9 14.2v2M1.8 9h2M14.2 9h2M3.9 3.9l1.4 1.4M12.7 12.7l1.4 1.4M14.1 3.9l-1.4 1.4M5.3 12.7l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
