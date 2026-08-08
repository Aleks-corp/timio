import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SettingsView } from "./SettingsView";

export const metadata: Metadata = {
  title: "Profile — Timio",
};

export default function SettingsPage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <SettingsView />
      </DashboardShell>
    </RequireAuth>
  );
}
