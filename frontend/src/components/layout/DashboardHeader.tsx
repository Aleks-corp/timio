"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/signin");
    } catch {
      setError("Couldn't sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
      <span className="font-helvetica text-widget-title text-heading">
        Timio
      </span>

      <div className="flex items-center gap-3">
        {error ? (
          <span className="text-caption text-error">{error}</span>
        ) : null}

        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-b from-accent-from to-accent-to text-xs font-bold text-white">
              {getInitials(user.name)}
            </div>
            <span className="hidden text-room-name text-heading sm:inline">
              {user.name}
            </span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Sign out"
          title="Sign out"
          className="flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-heading disabled:opacity-60"
        >
          <LogOut size={18} aria-hidden />
        </button>
      </div>
    </header>
  );
}
