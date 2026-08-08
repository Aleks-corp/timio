import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Schedule — Timio",
};

export default function SchedulePage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <div className="flex flex-col gap-6">
          <PageHeader eyebrow="Schedule" title="Weekly schedule" />
          <EmptyState
            icon={CalendarDays}
            title="The weekly schedule is coming soon"
            description="A full booking grid is next."
          />
        </div>
      </DashboardShell>
    </RequireAuth>
  );
}
