"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimezoneNotice } from "@/components/schedule/TimezoneNotice";
import { BookingTabs } from "@/components/booking/BookingTabs";
import { BookingList } from "@/components/booking/BookingList";
import { CancelBookingDialog } from "@/components/booking/CancelBookingDialog";
import { listRooms } from "@/lib/roomsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";
import { getBrowserTimeZone } from "@/lib/officeTime";
import type { MyBooking, MyBookingsSection } from "@/lib/bookingsApi";

export function MyBookingsView() {
  const timeZone = useMemo(() => getBrowserTimeZone(), []);
  const roomsState = useAsyncResource(listRooms);

  const roomFloorById = useMemo(() => {
    const map = new Map<string, number>();
    if (roomsState.status === "success") {
      for (const room of roomsState.data) {
        map.set(room.id, room.floor);
      }
    }
    return map;
  }, [roomsState]);

  const [section, setSection] = useState<MyBookingsSection>("upcoming");
  const [listVersion, setListVersion] = useState(0);
  const [cancelTarget, setCancelTarget] = useState<MyBooking | null>(null);

  function handleCancelled() {
    setCancelTarget(null);
    setListVersion((version) => version + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="My bookings"
        title="Your bookings"
        description="Manage your upcoming meetings and review your booking history."
      />
      <TimezoneNotice timeZone={timeZone} />
      <BookingTabs active={section} onChange={setSection} />
      <BookingList
        key={`${section}-${listVersion}`}
        section={section}
        timeZone={timeZone}
        roomFloorById={roomFloorById}
        onRequestCancel={setCancelTarget}
      />
      {cancelTarget ? (
        <CancelBookingDialog
          booking={cancelTarget}
          timeZone={timeZone}
          onClose={() => setCancelTarget(null)}
          onCancelled={handleCancelled}
        />
      ) : null}
    </div>
  );
}
