import { AlertCircle } from "lucide-react";

export function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex w-full items-start gap-2 rounded-button border border-error/30 bg-error-bg px-4 py-3 text-sm text-error"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
