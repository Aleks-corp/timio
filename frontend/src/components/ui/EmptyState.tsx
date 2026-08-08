import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-background text-muted">
        <Icon size={20} aria-hidden />
      </div>
      <p className="text-room-name text-heading">{title}</p>
      {description ? <p className="max-w-xs text-room-meta text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
