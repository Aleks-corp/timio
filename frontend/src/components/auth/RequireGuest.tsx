"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function RequireGuest({ children }: { children: ReactNode }) {
  const { status, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/account");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
