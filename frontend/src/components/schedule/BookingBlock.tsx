import clsx from "clsx";
import { formatTimeInZone } from "@/lib/officeTime";

interface BookingBlockProps {
  title: string;
  authorName: string;
  startAt: Date;
  endAt: Date;
  top: number;
  height: number;
  isMine: boolean;
  timeZone: string;
}

export function BookingBlock({
  title,
  authorName,
  startAt,
  endAt,
  top,
  height,
  isMine,
  timeZone,
}: BookingBlockProps) {
  const startLabel = formatTimeInZone(startAt, timeZone);
  const endLabel = formatTimeInZone(endAt, timeZone);
  const authorLabel = isMine ? "Mine" : authorName;
  const accessibleLabel = `${title}, ${authorLabel}, ${startLabel}–${endLabel}`;

  return (
    <div
      role="group"
      aria-label={accessibleLabel}
      title={accessibleLabel}
      className={clsx(
        "absolute inset-x-1 overflow-hidden rounded-button px-2 py-1.5 shadow-widget",
        isMine ? "bg-booking-mine" : "border border-booking-other-border bg-booking-other-bg",
      )}
      style={{ top, height }}
    >
      <p className={clsx("truncate text-[12px] font-medium leading-4", isMine ? "text-white" : "text-booking-other-text")}>
        {title}
      </p>
      <p
        className={clsx(
          "truncate text-[12px] leading-4",
          isMine ? "text-booking-mine-subtle" : "text-booking-other-subtle",
        )}
      >
        {authorLabel} · {startLabel}–{endLabel}
      </p>
    </div>
  );
}
