"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/portal/auth-context";

// Fetches a portal API route with the caller's Firebase ID token attached.
// In preview mode it returns the supplied demo value instead (clearly a
// sample). Keeps every portal page's data-loading identical and honest.

export type DataState<T> =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "ready"; data: T };

export function usePortalData<T>(path: string, demo: T): DataState<T> {
  const { user, preview } = useAuth();
  const [s, setS] = useState<DataState<T>>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (preview) {
        setS({ state: "ready", data: demo });
        return;
      }
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(path, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`${path} ${res.status}`);
        const data = (await res.json()) as T;
        if (!cancelled) setS({ state: "ready", data });
      } catch {
        if (!cancelled)
          setS({
            state: "error",
            message: "We couldn't load this right now. Refresh to try again.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
    // demo is stable per page; path/user/preview drive refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, user, preview]);

  return s;
}

/** POST helper that attaches the Firebase token (or no-ops in preview). */
export async function portalPost<T>(
  user: { getIdToken: () => Promise<string> } | null,
  path: string,
  body: unknown
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
  const res = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error ?? `${path} ${res.status}`);
  }
  return (await res.json()) as T;
}
