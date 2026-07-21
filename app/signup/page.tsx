import type { Metadata } from "next";
import { AuthShell } from "@/components/portal/auth-shell";
import { AuthForm } from "@/components/portal/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell>
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
