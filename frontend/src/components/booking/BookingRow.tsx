import Link from "next/link";
import { formatBookingDateLabel, formatBookingTimeRangeLabel, getBookingScheduleHref } from "@/lib/bookingUtils";
import type { MyBooking } from "@/lib/bookingsApi";
import { BookingStatus } from "./BookingStatus";

interface BookingRowProps {
  booking: MyBooking;
  roomFloor: number | undefined;
  timeZone: string;
  cancelable: boolean;
  onCancel: (booking: MyBooking) => void;
}

export function BookingRow({ booking, roomFloor, timeZone, cancelable, onCancel }: BookingRowProps) {
  const startAt = new Date(booking.startAt);
  const endAt = new Date(booking.endAt);
  const roomLabel = roomFloor !== undefined ? `${booking.room.name} · ${roomFloor} floor` : booking.room.name;

  return (
    <Link
      href={getBookingScheduleHref(booking.room.id, startAt)}
      className="grid grid-cols-1 gap-2 rounded-room-card border border-grid-border bg-card p-3 transition-colors hover:border-accent/60 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:p-4"
    >
      <p className="truncate text-room-name text-heading">{booking.title}</p>
      <p className="truncate text-room-meta text-muted">{roomLabel}</p>
      <p className="text-room-meta text-muted">{formatBookingDateLabel(startAt, timeZone)}</p>
      <p className="text-room-meta text-muted">{formatBookingTimeRangeLabel(startAt, endAt, timeZone)}</p>
      <div className="flex sm:justify-end">
        <BookingStatus cancelable={cancelable} onCancel={() => onCancel(booking)} />
      </div>
    </Link>
  );
}
