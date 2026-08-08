"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FormError } from "@/components/ui/FormError";
import { useAuth } from "@/providers/AuthProvider";

export function AccountView() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/signin");
    } catch {
      setLogoutError("Не вдалося вийти. Спробуйте ще раз.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div className="flex flex-col gap-1">
        <h1 className="text-hero text-heading">Hi, {user?.name}</h1>
        <p className="text-subtitle text-muted">{user?.email}</p>
      </div>
      {logoutError ? <FormError message={logoutError} /> : null}
      <div className="w-full max-w-[320px]">
        <PrimaryButton
          type="button"
          isLoading={isLoggingOut}
          onClick={handleLogout}
        >
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </PrimaryButton>
      </div>
    </div>
  );
}
