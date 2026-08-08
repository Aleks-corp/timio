import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign up — Timio",
  description: "Create a Timio account to book meeting rooms.",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
