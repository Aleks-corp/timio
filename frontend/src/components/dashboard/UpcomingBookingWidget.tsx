"use client";

import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { listMyUpcomingBookings } from "@/lib/bookingsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

export function UpcomingBookingWidget() {
  const state = useAsyncResource(() => listMyUpcomingBookings(1));

  return (
    <Card>
      <p className="mb-2 text-eyebrow uppercase text-muted">Your day</p>

      {state.status === "loading" ? (
        <LoadingState label="Checking your schedule…" />
      ) : null}

      {state.status === "error" ? <ErrorState message={state.message} /> : null}

      {state.status === "success" && state.data.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No upcoming bookings"
          description="Your next booked room will show up here."
        />
      ) : null}

      {state.status === "success" && state.data.length > 0
        ? (() => {
            const next = state.data[0];
            return (
              <div className="flex items-center gap-3">
                <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-accent-from to-accent-to text-white">
                  <CalendarClock size={22} aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-widget-title text-heading">
                    Next meeting at{" "}
                    {timeFormatter.format(new Date(next.startAt))}
                  </p>
                  <p className="text-room-meta text-muted">
                    {next.title} · {next.room.name}
                  </p>
                </div>
              </div>
            );
          })()
        : null}
    </Card>
  );
}
