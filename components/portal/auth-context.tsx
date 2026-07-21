"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { firebaseConfigured, watchAuth } from "@/lib/firebase-client";

// Global auth state. `preview` is a clearly-labeled demo mode that is ONLY
// possible while Firebase is NOT configured (so it can never mask real auth):
// it lets the portal be seen with sample data before the envs are wired.

export type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  preview: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  configured: false,
  preview: false,
});

const PREVIEW =
  process.env.NEXT_PUBLIC_PORTAL_PREVIEW === "1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = firebaseConfigured();
  const preview = PREVIEW && !configured;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let unsub: (() => void) | undefined;
    watchAuth((u) => {
      setUser(u);
      setLoading(false);
    }).then((fn) => (unsub = fn));
    return () => unsub?.();
  }, [configured]);

  return (
    <AuthContext.Provider value={{ user, loading, configured, preview }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
