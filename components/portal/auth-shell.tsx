"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { MarketLines } from "@/components/visuals/market-lines";
import { GradientMesh } from "@/components/visuals/gradient-mesh";

// Premium split-screen auth layout: live code-built market visual on one side,
// the form on the other. On mobile the visual collapses to a slim header band.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Visual side */}
      <div className="relative hidden w-[46%] overflow-hidden lg:block">
        <GradientMesh intensity="soft" />
        <MarketLines />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(10,10,10,0.2),rgba(10,10,10,0.75))]" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link href="/" aria-label="Smart Risk Assistant home">
            <Logo />
          </Link>
          <div>
            <p className="display max-w-sm text-4xl leading-tight text-text">
              Trade with a <span className="text-gradient">risk framework</span>.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              One account for the app and the advertiser portal. Sign in to
              manage your promotions to the trader community.
            </p>
          </div>
          <p className="text-xs text-faint">
            Trading involves risk of loss. Not financial advice.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex flex-1 flex-col">
        {/* Slim visual header on mobile */}
        <div className="relative h-28 overflow-hidden border-b border-line lg:hidden">
          <GradientMesh intensity="soft" />
          <MarketLines />
          <div className="absolute inset-0 bg-bg/40" />
          <div className="relative flex h-full items-center px-6">
            <Link href="/" aria-label="Smart Risk Assistant home">
              <Logo />
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
