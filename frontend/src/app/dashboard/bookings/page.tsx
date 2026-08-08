import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "My bookings — Timio",
};

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <div className="flex flex-col gap-6">
          <PageHeader eyebrow="My bookings" title="Your bookings" />
          <EmptyState
            icon={BookOpen}
            title="The full bookings list is coming soon"
            description="For now, check your next meeting on the dashboard."
          />
        </div>
      </DashboardShell>
    </RequireAuth>
  );
}
