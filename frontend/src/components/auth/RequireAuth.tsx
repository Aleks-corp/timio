"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
