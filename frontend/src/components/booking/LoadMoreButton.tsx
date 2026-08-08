import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function LoadMoreButton({ onClick, isLoading }: LoadMoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-button bg-background text-room-name text-heading transition-colors hover:bg-grid-today disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
      {isLoading ? "Loading…" : "Load more"}
    </button>
  );
}
