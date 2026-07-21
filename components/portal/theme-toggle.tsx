"use client";

import { useTheme, type ThemePref } from "@/lib/theme";
import { cn } from "@/lib/cn";

const options: { value: ThemePref; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "system", label: "Auto" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const { pref, setPref } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-full bg-portal-elevated p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={pref === o.value}
          onClick={() => setPref(o.value)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            pref === o.value
              ? "bg-portal-surface text-portal-text shadow-portal-soft"
              : "text-portal-muted hover:text-portal-text"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
