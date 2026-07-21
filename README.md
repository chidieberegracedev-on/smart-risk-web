# Smart Risk Assistant — Marketing Site

The official marketing/landing site for **Smart Risk Assistant**, a trading
risk-management platform. A protective layer between a trader's idea and
execution: position sizing, risk/reward, setup scoring, journaling, and more.

> Trading involves risk of loss. Smart Risk Assistant is a risk-management and
> decision-support tool — **not** financial advice, a signal service, or a
> guarantee of any outcome.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling (design tokens in `tailwind.config.ts`)
- **Framer Motion** for choreographed, reduced-motion-aware animation
- **next/font** — Space Grotesk (display), Inter (body), JetBrains Mono (data)
- Deployable to **Vercel**, no backend required for this pass

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Project structure

```
app/                       # App Router pages + route metadata
  layout.tsx               # fonts, SEO defaults, nav + footer
  page.tsx                 # Home
  features/                # Features
  how-it-works/            # Risk-first workflow
  learn/                   # Learning resources (coming-soon shell)
  advertise/               # Advertiser marketing page + portal CTA
  download/                # Get the app
  sitemap.ts / robots.ts   # SEO
components/
  layout/                  # Nav, Footer
  sections/                # Page sections (Hero, Problem, HowItWorks, ...)
  visuals/                 # Code-built product visuals (risk console, dials)
  motion/                  # Reveal / Stagger wrappers
  ui/                      # Button, Badge, Logo, icons, headings
lib/                       # site content/config, motion tokens, helpers
```

## Design system

- **Dark-first**, layered surfaces — depth through tone, not heavy borders.
- Near-black background `#0A0A0A`; panels `#121214` / `#1A1A1D`.
- Restrained **muted-blue** accent `#5B8CFF`; **green** `#3FB97F` for
  verified/positive; **amber** `#E0A63C` for caution.
- Typography-led: large confident display type, tight tracking, monospaced
  numerics for all data.
- Motion is choreographed and restrained, with a full
  `prefers-reduced-motion` fallback.

## Messaging guardrails

All copy lives in `lib/site.ts` and follows strict rules for a financial
product: **no** profit promises, guaranteed returns, prediction claims, or
signal-selling framing. Everything is framed around **risk control,
discipline, and better decisions**. A risk disclaimer appears in the footer.

## Advertiser portal (next phase)

This repo is the marketing site only. The authenticated advertiser portal
(auth + Supabase + payments) is a separate, later phase. The `/advertise`
page and its CTA are the entry point; the codebase is organised so an
authenticated `/advertise/portal` section can be added without restructuring.
