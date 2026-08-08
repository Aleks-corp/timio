"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/providers/AuthProvider";

export function SettingsView() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Profile" title="Your account" />
      <Card className="flex max-w-sm flex-col gap-1">
        <p className="text-room-name text-heading">{user?.name}</p>
        <p className="text-room-meta text-muted">{user?.email}</p>
      </Card>
      <EmptyState
        icon={SettingsIcon}
        title="Profile management is coming soon"
        description="Changing your name, email and password is next."
      />
    </div>
  );
}
