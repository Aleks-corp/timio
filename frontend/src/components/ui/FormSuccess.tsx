import { CheckCircle2 } from "lucide-react";

export function FormSuccess({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="flex w-full items-start gap-2 rounded-button border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-strong"
    >
      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
