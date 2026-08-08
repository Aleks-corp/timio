import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MyBookingsView } from "./MyBookingsView";

export const metadata: Metadata = {
  title: "My bookings — Timio",
};

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <MyBookingsView />
      </DashboardShell>
    </RequireAuth>
  );
}
