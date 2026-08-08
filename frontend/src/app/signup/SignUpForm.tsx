"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Logo } from "@/components/ui/Logo";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";
import { signup, ApiError } from "@/lib/api";
import { signUpSchema, type SignUpFormValues } from "@/lib/validation";

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdUserName, setCreatedUserName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);
    try {
      const { user } = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setCreatedUserName(user.name);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setServerError("Something went wrong. Please try again.");
        return;
      }

      const lowerMessage = error.message.toLowerCase();
      if (lowerMessage.includes("email")) {
        setError("email", { message: error.message });
      } else if (lowerMessage.includes("password")) {
        setError("password", { message: error.message });
      } else if (lowerMessage.includes("name")) {
        setError("name", { message: error.message });
      } else {
        setServerError(error.message);
      }
    }
  };

  if (createdUserName) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo />
        <h1 className="text-hero text-heading">Welcome, {createdUserName}!</h1>
        <FormSuccess message="Your account has been created and you're signed in." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo />
        <div className="flex flex-col gap-1">
          <h1 className="text-hero text-heading">Get started with Timio</h1>
          <p className="text-subtitle text-muted">
            Create an account to book meeting rooms, manage reservations and see live
            availability.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          disabled
          aria-disabled
          title="Google sign-up is coming soon"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-input bg-gradient-to-b from-google-from to-google-to text-google-btn text-strong shadow-google disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Image src="/icons/google.svg" alt="" width={24} height={24} aria-hidden />
          Sign up with Google
        </button>
        <p className="text-center text-caption text-muted-light">Or sign up with email</p>
      </div>

      {serverError ? <FormError message={serverError} /> : null}

      <div className="flex w-full flex-col gap-4">
        <TextInput
          label="Full name"
          placeholder="e.g. Iryna Haran"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Repeat password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div className="flex w-full flex-col items-center gap-2.5">
        <PrimaryButton type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </PrimaryButton>
        <Link href="/signin" className="text-caption text-muted-mid hover:text-strong">
          Already have an account?
        </Link>
      </div>
    </form>
  );
}
