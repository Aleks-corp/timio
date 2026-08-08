"use client";

import { DoorOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { listRooms } from "@/lib/roomsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";
import { RoomCard } from "./RoomCard";

function RoomCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-2.5 rounded-room-card border border-border bg-card p-2">
      <div className="size-[86px] shrink-0 rounded-[8px] bg-background" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/3 rounded bg-background" />
        <div className="h-3 w-1/2 rounded bg-background" />
      </div>
    </div>
  );
}

export function RoomsGrid() {
  const state = useAsyncResource(listRooms);

  return (
    <Card>
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-widget-title text-heading">Rooms</h2>
        <p className="text-room-meta text-muted">Tap a room to open its schedule.</p>
      </div>

      {state.status === "loading" ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {state.status === "error" ? <ErrorState message={state.message} /> : null}

      {state.status === "success" && state.data.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No rooms yet"
          description="The list of meeting rooms will appear once they're added."
        />
      ) : null}

      {state.status === "success" && state.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {state.data.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      ) : null}
    </Card>
  );
}
