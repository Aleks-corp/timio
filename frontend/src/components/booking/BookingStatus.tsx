import type { MouseEvent } from "react";

interface BookingStatusProps {
  cancelable: boolean;
  onCancel: () => void;
}

export function BookingStatus({ cancelable, onCancel }: BookingStatusProps) {
  if (!cancelable) {
    return <span className="text-caption text-muted-light">Past</span>;
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onCancel();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-11 items-center justify-center rounded-full bg-cancel-bg px-4 text-caption font-medium text-cancel-text transition-opacity hover:opacity-80"
    >
      Cancel
    </button>
  );
}
