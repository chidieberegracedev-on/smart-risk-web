"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import {
  signInEmail,
  signUpEmail,
  signInGoogle,
  resetPassword,
  authErrorMessage,
} from "@/lib/firebase-client";

// Shared login/signup form. Honest validation and error copy; redirects to
// /portal on success (and when already signed in).

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { user, configured, preview } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in (or preview) → straight to the portal.
  useEffect(() => {
    if (user || preview) router.replace("/portal");
  }, [user, preview, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!configured) {
      setError("Sign-in isn't configured on this environment yet.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") await signInEmail(email.trim(), password);
      else await signUpEmail(email.trim(), password);
      router.replace("/portal");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    if (!configured) {
      setError("Sign-in isn't configured on this environment yet.");
      return;
    }
    setBusy(true);
    try {
      await signInGoogle();
      router.replace("/portal");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    setError(null);
    setNotice(null);
    if (!configured) {
      setError("Sign-in isn't configured on this environment yet.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email above first, then tap “Forgot password”.");
      return;
    }
    try {
      await resetPassword(email.trim());
      setNotice("Password reset email sent — check your inbox.");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="display text-3xl text-text">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login"
          ? "Sign in with the same account you use in the app."
          : "One account for the app and the advertiser portal."}
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-faint">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border border-line-strong bg-panel px-4 text-[15px] text-text outline-none transition-colors placeholder:text-faint focus:border-accent"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-faint">
            Password
          </span>
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border border-line-strong bg-panel px-4 text-[15px] text-text outline-none transition-colors placeholder:text-faint focus:border-accent"
            placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
          />
        </label>

        {mode === "login" && (
          <button
            type="button"
            onClick={forgot}
            className="-mt-1 self-end text-xs text-muted transition-colors hover:text-text"
          >
            Forgot password?
          </button>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}
        {notice && <p className="text-sm text-verified">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 h-12 cursor-pointer rounded-full bg-accent text-[15px] font-medium text-white transition-colors hover:bg-[#6E9BFF] disabled:opacity-60"
        >
          {busy
            ? "One moment…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>

        <button
          type="button"
          onClick={google}
          disabled={busy}
          className="flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-line-strong bg-panel-2 text-[15px] font-medium text-text transition-colors hover:bg-panel-3 disabled:opacity-60"
        >
          <GoogleGlyph /> Continue with Google
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.1 3.57-5.18 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.35.6 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}
