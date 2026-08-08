import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RequireGuest } from "@/components/auth/RequireGuest";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in — Timio",
  description: "Sign in to your Timio account.",
};

export default function SignInPage() {
  return (
    <RequireGuest>
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </RequireGuest>
  );
}
