import {
  Space_Grotesk,
  Inter,
  JetBrains_Mono,
} from "next/font/google";

// Display — geometric grotesk, big confident headings with tight tracking.
export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Body / UI — high legibility.
export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Data — every number: lot sizes, R:R, percentages, prices.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
