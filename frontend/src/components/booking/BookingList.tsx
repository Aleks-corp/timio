"use client";

import { useState } from "react";
import { CalendarClock, History } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ApiError } from "@/lib/api";
import { listMyBookings, type MyBooking, type MyBookingsSection } from "@/lib/bookingsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";
import { BookingRow } from "./BookingRow";
import { LoadMoreButton } from "./LoadMoreButton";

const PAGE_SIZE = 10;

interface BookingListProps {
  section: MyBookingsSection;
  timeZone: string;
  roomFloorById: Map<string, number>;
  onRequestCancel: (booking: MyBooking) => void;
}

function BookingRowSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-room-card border border-grid-border bg-card p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <div className="h-4 w-1/3 rounded bg-background" />
      <div className="h-3 w-1/4 rounded bg-background" />
      <div className="h-3 w-1/5 rounded bg-background" />
      <div className="h-3 w-1/5 rounded bg-background" />
    </div>
  );
}

export function BookingList({ section, timeZone, roomFloorById, onRequestCancel }: BookingListProps) {
  const [retryToken, setRetryToken] = useState(0);
  const firstPageState = useAsyncResource(
    () => listMyBookings({ section, limit: PAGE_SIZE, offset: 0 }),
    [section, retryToken],
  );

  const [extraPages, setExtraPages] = useState<MyBooking[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [lastPageSize, setLastPageSize] = useState<number | null>(null);

  const firstPageItems = firstPageState.status === "success" ? firstPageState.data : [];
  const items = [...firstPageItems, ...extraPages];
  const effectiveLastPageSize =
    lastPageSize ?? (firstPageState.status === "success" ? firstPageItems.length : null);
  const hasMore = effectiveLastPageSize !== null && effectiveLastPageSize === PAGE_SIZE;

  async function handleLoadMore() {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const next = await listMyBookings({ section, limit: PAGE_SIZE, offset: items.length });
      setExtraPages((prev) => [...prev, ...next]);
      setLastPageSize(next.length);
    } catch (error) {
      setLoadMoreError(error instanceof ApiError ? error.message : "Couldn't load more bookings.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {firstPageState.status === "loading" ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <BookingRowSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {firstPageState.status === "error" ? (
        <ErrorState message={firstPageState.message} onRetry={() => setRetryToken((token) => token + 1)} />
      ) : null}

      {firstPageState.status === "success" && items.length === 0 ? (
        <EmptyState
          icon={section === "upcoming" ? CalendarClock : History}
          title={section === "upcoming" ? "No upcoming bookings" : "No past bookings"}
          description={
            section === "upcoming"
              ? "Book a room from the weekly schedule to see it here."
              : "Bookings move here once their time has passed."
          }
        />
      ) : null}

      {firstPageState.status === "success" && items.length > 0 ? (
        <>
          <div className="flex flex-col gap-2">
            {items.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                roomFloor={roomFloorById.get(booking.room.id)}
                timeZone={timeZone}
                cancelable={section === "upcoming"}
                onCancel={onRequestCancel}
              />
            ))}
          </div>
          {loadMoreError ? <ErrorState message={loadMoreError} onRetry={handleLoadMore} /> : null}
          {hasMore ? <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadingMore} /> : null}
        </>
      ) : null}
    </div>
  );
}
