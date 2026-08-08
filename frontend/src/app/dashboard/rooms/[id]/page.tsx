import type { Metadata } from "next";
import { CalendarRange } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Room schedule — Timio",
};

export default function RoomSchedulePage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <div className="flex flex-col gap-6">
          <PageHeader eyebrow="Room" title="Room schedule" />
          <EmptyState
            icon={CalendarRange}
            title="This room's schedule is coming soon"
            description="A weekly booking grid for this room is next."
          />
        </div>
      </DashboardShell>
    </RequireAuth>
  );
}
