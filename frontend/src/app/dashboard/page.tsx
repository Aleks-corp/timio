import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardHome } from "./DashboardHome";

export const metadata: Metadata = {
  title: "Dashboard — Timio",
};

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardShell>
        <DashboardHome />
      </DashboardShell>
    </RequireAuth>
  );
}
