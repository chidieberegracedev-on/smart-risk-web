"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Minimal Dark / Light / System theming. The preference is persisted in
// localStorage and applied to <html data-theme> BEFORE paint by THEME_INIT
// (inlined in the root layout head), so there is no flash of the wrong theme.
// Marketing pages use fixed dark tokens and are unaffected by the toggle.

export type ThemePref = "dark" | "light" | "system";

export const THEME_STORAGE_KEY = "srw-theme";

// Kept as a plain string so it can be inlined into a <script> tag.
export const THEME_INIT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"dark";var r=t==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):t;document.documentElement.dataset.theme=r;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

function resolve(pref: ThemePref): "dark" | "light" {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  return pref;
}

const ThemeContext = createContext<{
  pref: ThemePref;
  resolved: "dark" | "light";
  setPref: (p: ThemePref) => void;
}>({ pref: "dark", resolved: "dark", setPref: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("dark");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as ThemePref) || "dark";
    setPrefState(stored);
    setResolved(resolve(stored));
  }, []);

  // Follow OS changes while in system mode.
  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const r = resolve("system");
      setResolved(r);
      document.documentElement.dataset.theme = r;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p);
    localStorage.setItem(THEME_STORAGE_KEY, p);
    const r = resolve(p);
    setResolved(r);
    document.documentElement.dataset.theme = r;
  }, []);

  return (
    <ThemeContext.Provider value={{ pref, resolved, setPref }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
