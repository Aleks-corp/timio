import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AccountView } from "./AccountView";

export const metadata: Metadata = {
  title: "Account — Timio",
};

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountView />
    </RequireAuth>
  );
}
