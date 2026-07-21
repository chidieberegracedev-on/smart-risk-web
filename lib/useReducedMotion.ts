"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

// Thin re-export so components have a single import site, and we can extend
// behaviour later if needed. Framer already reads the media query + reacts.
export function usePrefersReducedMotion(): boolean {
  return !!useFramerReducedMotion();
}
