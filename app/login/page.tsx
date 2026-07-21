import type { Metadata } from "next";
import { AuthShell } from "@/components/portal/auth-shell";
import { AuthForm } from "@/components/portal/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
