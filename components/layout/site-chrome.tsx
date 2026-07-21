"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";

// Marketing chrome (nav, footer, scroll rail) wraps public pages only.
// The portal and the auth pages ship their own minimal chrome.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/portal") ||
    pathname === "/login" ||
    pathname === "/signup";

  if (bare) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
