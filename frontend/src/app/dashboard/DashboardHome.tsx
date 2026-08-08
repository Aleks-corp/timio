"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { RoomsGrid } from "@/components/dashboard/RoomsGrid";
import { UpcomingBookingWidget } from "@/components/dashboard/UpcomingBookingWidget";
import { useAuth } from "@/providers/AuthProvider";

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard"
        title={user ? `Welcome, ${user.name}!` : "Welcome!"}
        description="Your day and the rooms available."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <RoomsGrid />
        <UpcomingBookingWidget />
      </div>
    </div>
  );
}
