import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Layered dark surfaces — depth through tone, not borders
        bg: "#0A0A0A",
        panel: "#121214",
        "panel-2": "#1A1A1D",
        "panel-3": "#212125",
        line: "#26262B",
        "line-strong": "#33333A",
        // Text hierarchy
        text: "#F5F5F7",
        muted: "#A1A1A6",
        faint: "#6E6E73",
        // Restrained accents
        accent: "#5B8CFF",
        "accent-soft": "#3B62C9",
        verified: "#3FB97F",
        caution: "#E0A63C",
        danger: "#E5484D",
        // Portal tokens — CSS variables so Dark/Light/System all share one
        // component set. Marketing pages keep the fixed tokens above.
        portal: {
          bg: "var(--p-bg)",
          surface: "var(--p-surface)",
          elevated: "var(--p-elevated)",
          text: "var(--p-text)",
          muted: "var(--p-muted)",
          faint: "var(--p-faint)",
          line: "var(--p-line)",
          accent: "#3B6FD4",
          positive: "#7FB069",
          pending: "#D9A441",
          danger: "#E0685A",
        },
      },
      boxShadow: {
        // Depth for light mode (dark mode uses tone-lift instead)
        "portal-soft": "var(--p-shadow)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.03em",
      },
      maxWidth: {
        container: "1200px",
        prose: "680px",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      keyframes: {
        "mesh-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.08)" },
        },
        "mesh-drift-2": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-3%, 2%, 0) scale(1)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.7", transform: "scale(0.9)" },
          "70%, 100%": { opacity: "0", transform: "scale(1.6)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "mesh-drift": "mesh-drift 18s ease-in-out infinite",
        "mesh-drift-2": "mesh-drift-2 22s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.8s ease-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
