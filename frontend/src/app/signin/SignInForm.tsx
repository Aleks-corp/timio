"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Logo } from "@/components/ui/Logo";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FormError } from "@/components/ui/FormError";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { signInSchema, type SignInFormValues } from "@/lib/validation";

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (values: SignInFormValues) => {
    setServerError(null);
    try {
      await login({ email: values.email, password: values.password });
      router.push("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Couldn't sign in. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full flex-col items-center gap-6"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo />
        <div className="flex flex-col gap-1">
          <h1 className="text-hero text-heading">Welcome back to Timio</h1>
          <p className="text-subtitle text-muted">
            Sign in to manage your bookings and see live availability.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          disabled
          aria-disabled
          title="Google sign-in is coming soon"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-input bg-gradient-to-b from-google-from to-google-to text-google-btn text-strong shadow-google disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Image
            src="/icons/google.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
          Sign in with Google
        </button>
        <p className="text-center text-caption text-muted-light">
          Or sign in with email
        </p>
      </div>

      {serverError ? <FormError message={serverError} /> : null}

      <div className="flex w-full flex-col gap-4">
        <TextInput
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="flex w-full flex-col items-center gap-2.5">
        <PrimaryButton type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </PrimaryButton>
        <Link
          href="/signup"
          className="text-caption text-muted-mid hover:text-strong"
        >
          Don&apos;t have an account?
        </Link>
      </div>
    </form>
  );
}
