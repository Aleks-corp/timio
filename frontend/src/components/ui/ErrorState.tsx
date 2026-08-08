import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-error-bg text-error">
        <AlertTriangle size={20} aria-hidden />
      </div>
      <p className="text-room-name text-heading">Something went wrong</p>
      <p className="max-w-xs text-room-meta text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 text-caption text-accent hover:underline"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
