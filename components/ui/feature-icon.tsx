// SVG icon set for features — never emoji (per design rules).
// 20px, 1.5 stroke, currentColor. Mapped by feature title with a fallback.

const s = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons: Record<string, JSX.Element> = {
  "Risk & lot-size calculator": (
    <svg {...s}>
      <rect x="4" y="2.5" width="12" height="15" rx="2" />
      <path d="M7 6h6M7 9.5h2M11 9.5h2M7 13h2M11 13h2" />
    </svg>
  ),
  "Trade setup analysis": (
    <svg {...s}>
      <path d="M3 16V4M3 16h14" />
      <path d="M6 12l3-4 3 2 4-6" />
    </svg>
  ),
  "Risk / reward evaluation": (
    <svg {...s}>
      <path d="M10 3v14" />
      <path d="M4 7l6-3 6 3" />
      <path d="M2.5 11a2.5 2.5 0 004.8 0M12.7 9a2.5 2.5 0 004.8 0" />
    </svg>
  ),
  "Trade quality scoring": (
    <svg {...s}>
      <path d="M10 2.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 13.9 5.8 15.5l.8-4.7L3.2 7.5l4.7-.7z" />
    </svg>
  ),
  "Signal interpretation": (
    <svg {...s}>
      <path d="M4 10a6 6 0 016-6M4.5 13.5a3.2 3.2 0 013-5.5" />
      <circle cx="10" cy="10" r="1.4" />
      <path d="M12 12l3.5 3.5" />
    </svg>
  ),
  "Trading journal & tracking": (
    <svg {...s}>
      <path d="M5 3h8a2 2 0 012 2v10a2 2 0 01-2 2H5z" />
      <path d="M5 3v14" />
      <path d="M8.5 7.5h4M8.5 10.5h4M8.5 13.5h2" />
    </svg>
  ),
  "AI chart & trade analysis": (
    <svg {...s}>
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2" />
      <circle cx="10" cy="10" r="3.2" />
      <path d="M10 8.5v1.5l1 1" />
    </svg>
  ),
  "Behavioral & risk warnings": (
    <svg {...s}>
      <path d="M10 3l7 12.5H3z" />
      <path d="M10 8v3M10 13.4v.1" />
    </svg>
  ),
};

const fallback = (
  <svg {...s}>
    <circle cx="10" cy="10" r="6.5" />
    <path d="M10 6.5v3.5l2.2 1.5" />
  </svg>
);

export function FeatureIcon({ name }: { name: string }) {
  return icons[name] ?? fallback;
}
