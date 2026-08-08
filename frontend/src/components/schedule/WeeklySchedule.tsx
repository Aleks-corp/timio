"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { getRoomWeekSchedule, type RoomWeekBooking } from "@/lib/roomsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";
import { useAuth } from "@/providers/AuthProvider";
import {
  OFFICE_TIMEZONE,
  addDaysInZone,
  formatDateKey,
  getOfficeDayRange,
  isSameDayInZone,
} from "@/lib/officeTime";
import { getGridPixelHeight } from "@/lib/scheduleLayout";
import { WeekNavigation } from "./WeekNavigation";
import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";
import { PX_PER_MINUTE } from "./gridConstants";

interface WeeklyScheduleProps {
  roomId: string;
  weekStart: Date;
  currentWeekStart: Date;
  timeZone: string;
  refreshToken: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onSlotSelect: (payload: { roomId: string; startAt: Date }) => void;
}

function WeeklyScheduleSkeleton() {
  return (
    <div className="animate-pulse space-y-2 p-4">
      <div className="h-4 w-40 rounded bg-background" />
      <div className="rounded-lg bg-background" style={{ height: getGridPixelHeight(PX_PER_MINUTE) }} />
    </div>
  );
}

export function WeeklySchedule({
  roomId,
  weekStart,
  currentWeekStart,
  timeZone,
  refreshToken,
  onPreviousWeek,
  onNextWeek,
  onToday,
  onSlotSelect,
}: WeeklyScheduleProps) {
  const { user } = useAuth();
  const [retryToken, setRetryToken] = useState(0);
  const weekKey = formatDateKey(weekStart);

  const state = useAsyncResource(
    () => getRoomWeekSchedule(roomId, weekKey),
    [roomId, weekKey, retryToken, refreshToken],
  );

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const isCurrentWeek = weekKey === formatDateKey(currentWeekStart);

  return (
    <Card className="flex min-w-0 flex-col gap-0 p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-grid-border p-4">
        <p className="text-room-meta text-muted">30-minute slots · office hours 09:00–19:00 (Kyiv time)</p>
        <WeekNavigation
          weekStart={weekStart}
          isCurrentWeek={isCurrentWeek}
          onPrevious={onPreviousWeek}
          onNext={onNextWeek}
          onToday={onToday}
        />
      </div>

      <div className="min-w-0 p-2 sm:p-3">
        {state.status === "loading" ? <WeeklyScheduleSkeleton /> : null}

        {state.status === "error" ? (
          <ErrorState message={state.message} onRetry={() => setRetryToken((token) => token + 1)} />
        ) : null}

        {state.status === "success" ? (
          <>
            {state.data.bookings.length === 0 ? (
              <p className="px-1 pb-2 text-room-meta text-muted">No bookings for this room this week.</p>
            ) : null}
            <ScheduleGrid
              weekStart={weekStart}
              bookings={state.data.bookings}
              currentUserId={user?.id}
              timeZone={timeZone}
              now={now}
              onSlotClick={(startAt) => onSlotSelect({ roomId, startAt })}
            />
          </>
        ) : null}
      </div>
    </Card>
  );
}

interface ScheduleGridProps {
  weekStart: Date;
  bookings: RoomWeekBooking[];
  currentUserId: string | undefined;
  timeZone: string;
  now: Date;
  onSlotClick: (startAt: Date) => void;
}

function ScheduleGrid({ weekStart, bookings, currentUserId, timeZone, now, onSlotClick }: ScheduleGridProps) {
  const days = Array.from({ length: 7 }, (_, index) => addDaysInZone(weekStart, index));
  const mondayRange = getOfficeDayRange(weekStart);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[780px]">
        <TimeColumn dayRange={mondayRange} timeZone={timeZone} pxPerMinute={PX_PER_MINUTE} />
        {days.map((dayDate, index) => {
          const dayRange = getOfficeDayRange(dayDate);
          const dayBookings = bookings.filter((booking) =>
            isSameDayInZone(new Date(booking.startAt), dayDate, OFFICE_TIMEZONE),
          );

          return (
            <DayColumn
              key={index}
              dayDate={dayDate}
              dayRange={dayRange}
              bookings={dayBookings}
              currentUserId={currentUserId}
              timeZone={timeZone}
              pxPerMinute={PX_PER_MINUTE}
              isToday={isSameDayInZone(now, dayDate, OFFICE_TIMEZONE)}
              isWeekend={index >= 5}
              now={now}
              onSlotClick={onSlotClick}
            />
          );
        })}
      </div>
    </div>
  );
}
