import { type MouseEvent } from "react";
import clsx from "clsx";
import { OFFICE_TIMEZONE, GRID_TOTAL_MINUTES, type OfficeDayRange } from "@/lib/officeTime";
import type { RoomWeekBooking } from "@/lib/roomsApi";
import {
  getBookingBlockHeight,
  getBookingBlockTop,
  getGridPixelHeight,
  getNowLineTop,
  isBookingVisibleInDay,
} from "@/lib/scheduleLayout";
import { BookingBlock } from "./BookingBlock";
import { DAY_COLUMN_MIN_WIDTH, DAY_HEADER_HEIGHT } from "./gridConstants";

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: OFFICE_TIMEZONE });
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: OFFICE_TIMEZONE });

interface DayColumnProps {
  dayDate: Date;
  dayRange: OfficeDayRange;
  bookings: RoomWeekBooking[];
  currentUserId: string | undefined;
  timeZone: string;
  pxPerMinute: number;
  isToday: boolean;
  isWeekend: boolean;
  now: Date;
  onSlotClick: (startAt: Date) => void;
}

export function DayColumn({
  dayDate,
  dayRange,
  bookings,
  currentUserId,
  timeZone,
  pxPerMinute,
  isToday,
  isWeekend,
  now,
  onSlotClick,
}: DayColumnProps) {
  const gridHeight = getGridPixelHeight(pxPerMinute);
  const nowTop = isToday ? getNowLineTop(now, dayRange, pxPerMinute) : null;
  const hourLineCount = GRID_TOTAL_MINUTES / 60;

  function handleSlotAreaClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const rawMinutes = offsetY / pxPerMinute;
    const snappedMinutes = Math.min(Math.max(Math.floor(rawMinutes / 30) * 30, 0), GRID_TOTAL_MINUTES - 30);
    onSlotClick(new Date(dayRange.start.getTime() + snappedMinutes * 60000));
  }

  return (
    <div
      className="relative flex flex-1 flex-col border-l border-grid-border first:border-l-0"
      style={{ minWidth: DAY_COLUMN_MIN_WIDTH }}
    >
      <div
        className={clsx(
          "flex flex-col justify-center gap-0.5 border-b border-grid-border px-2.5",
          isToday ? "bg-grid-today" : isWeekend ? "bg-grid-weekend" : "bg-card",
        )}
        style={{ height: DAY_HEADER_HEIGHT }}
      >
        <p className={clsx("text-room-meta font-medium", isToday ? "text-accent" : "text-heading")}>
          {weekdayFormatter.format(dayDate)}
        </p>
        <p className="text-caption text-grid-muted">{dateFormatter.format(dayDate)}</p>
      </div>

      <div
        className={clsx("relative cursor-pointer", isWeekend ? "bg-grid-weekend" : undefined)}
        style={{ height: gridHeight }}
        onClick={handleSlotAreaClick}
      >
        {Array.from({ length: hourLineCount }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-x-0 border-t border-grid-border"
            style={{ top: i * 60 * pxPerMinute }}
            aria-hidden
          />
        ))}

        {bookings.map((booking) => {
          const startAt = new Date(booking.startAt);
          const endAt = new Date(booking.endAt);
          if (!isBookingVisibleInDay(startAt, endAt, dayRange)) return null;

          return (
            <BookingBlock
              key={booking.id}
              title={booking.title}
              authorName={booking.user.name}
              startAt={startAt}
              endAt={endAt}
              top={getBookingBlockTop(startAt, dayRange, pxPerMinute)}
              height={getBookingBlockHeight(startAt, endAt, dayRange, pxPerMinute)}
              isMine={currentUserId !== undefined && currentUserId === booking.userId}
              timeZone={timeZone}
            />
          );
        })}

        {nowTop !== null ? (
          <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: nowTop }}>
            <div className="relative">
              <span className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-now-line" />
              <div className="h-px w-full bg-now-line" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
