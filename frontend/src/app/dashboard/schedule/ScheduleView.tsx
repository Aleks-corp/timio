"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { TimezoneNotice } from "@/components/schedule/TimezoneNotice";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { RoomScheduleSelector } from "@/components/schedule/RoomScheduleSelector";
import { BookingDrawer } from "@/components/booking/BookingDrawer";
import { listRooms, type Room } from "@/lib/roomsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";
import {
  addDaysInZone,
  dateKeyToOfficeMidnight,
  formatDateKey,
  getBrowserTimeZone,
  getMondayOfWeek,
  isMondayDateKey,
} from "@/lib/officeTime";

export function ScheduleView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [retryToken, setRetryToken] = useState(0);
  const roomsState = useAsyncResource(listRooms, [retryToken]);

  const [selectedSlot, setSelectedSlot] = useState<{ roomId: string; startAt: Date } | null>(null);
  const [scheduleRefreshToken, setScheduleRefreshToken] = useState(0);

  const timeZone = useMemo(() => getBrowserTimeZone(), []);
  const currentWeekStart = useMemo(() => getMondayOfWeek(new Date()), []);

  const roomIdParam = searchParams.get("roomId");
  const weekParam = searchParams.get("week");

  const weekStart = useMemo(() => {
    if (weekParam && isMondayDateKey(weekParam)) {
      const officeMidnight = dateKeyToOfficeMidnight(weekParam);
      if (officeMidnight) return officeMidnight;
    }
    return currentWeekStart;
  }, [weekParam, currentWeekStart]);

  const rooms = useMemo(
    () => (roomsState.status === "success" ? roomsState.data : []),
    [roomsState],
  );
  const resolvedRoom: Room | null = useMemo(() => {
    if (rooms.length === 0) return null;
    if (roomIdParam) {
      const found = rooms.find((room) => room.id === roomIdParam);
      if (found) return found;
    }
    return rooms[0];
  }, [rooms, roomIdParam]);

  useEffect(() => {
    if (roomsState.status !== "success" || !resolvedRoom) return;

    const canonicalWeek = formatDateKey(weekStart);
    if (roomIdParam === resolvedRoom.id && weekParam === canonicalWeek) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("roomId", resolvedRoom.id);
    params.set("week", canonicalWeek);
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    roomsState.status,
    resolvedRoom,
    weekStart,
    roomIdParam,
    weekParam,
    pathname,
    router,
    searchParams,
  ]);

  function navigateTo(nextRoomId: string, nextWeekStart: Date) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("roomId", nextRoomId);
    params.set("week", formatDateKey(nextWeekStart));
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleSelectRoom = (room: Room) => navigateTo(room.id, weekStart);
  const handlePreviousWeek = () =>
    resolvedRoom && navigateTo(resolvedRoom.id, addDaysInZone(weekStart, -7));
  const handleNextWeek = () =>
    resolvedRoom && navigateTo(resolvedRoom.id, addDaysInZone(weekStart, 7));
  const handleToday = () =>
    resolvedRoom && navigateTo(resolvedRoom.id, currentWeekStart);

  const handleSlotSelect = (payload: { roomId: string; startAt: Date }) => setSelectedSlot(payload);
  const handleDrawerClose = () => setSelectedSlot(null);
  const handleBookingCreated = () => {
    setSelectedSlot(null);
    setScheduleRefreshToken((token) => token + 1);
  };
  const handleBookingConflict = () => setScheduleRefreshToken((token) => token + 1);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Schedule"
        title="Weekly schedule"
        description="Browse a room's week and see who's booked what."
      />

      {roomsState.status === "loading" ? (
        <LoadingState label="Loading rooms…" />
      ) : null}

      {roomsState.status === "error" ? (
        <ErrorState
          message={roomsState.message}
          onRetry={() => setRetryToken((token) => token + 1)}
        />
      ) : null}

      {roomsState.status === "success" && rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No rooms yet"
          description="Add a room before scheduling a week."
        />
      ) : null}

      {roomsState.status === "success" && resolvedRoom ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <div className="order-2 flex min-w-0 flex-col gap-4 lg:order-1">
            <ScheduleHeader
              room={resolvedRoom}
              roomIndex={rooms.findIndex((room) => room.id === resolvedRoom.id)}
            />
            <TimezoneNotice timeZone={timeZone} />
            <WeeklySchedule
              roomId={resolvedRoom.id}
              weekStart={weekStart}
              currentWeekStart={currentWeekStart}
              timeZone={timeZone}
              refreshToken={scheduleRefreshToken}
              onPreviousWeek={handlePreviousWeek}
              onNextWeek={handleNextWeek}
              onToday={handleToday}
              onSlotSelect={handleSlotSelect}
            />
          </div>
          <div className="order-1 lg:order-2">
            <RoomScheduleSelector
              state={roomsState}
              selectedRoomId={resolvedRoom.id}
              onSelect={handleSelectRoom}
              onRetry={() => setRetryToken((token) => token + 1)}
            />
          </div>
        </div>
      ) : null}

      {selectedSlot ? (
        <BookingDrawer
          rooms={rooms}
          roomId={selectedSlot.roomId}
          startAt={selectedSlot.startAt}
          defaultDurationMinutes={60}
          weekStart={weekStart}
          timeZone={timeZone}
          onClose={handleDrawerClose}
          onCreated={handleBookingCreated}
          onBookingConflict={handleBookingConflict}
        />
      ) : null}
    </div>
  );
}
