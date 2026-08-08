import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LoadingState } from "@/components/ui/LoadingState";
import { ScheduleView } from "./ScheduleView";

export const metadata: Metadata = {
  title: "Schedule — Timio",
};

export default function SchedulePage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <Suspense fallback={<LoadingState label="Loading schedule…" />}>
          <ScheduleView />
        </Suspense>
      </DashboardShell>
    </RequireAuth>
  );
}
