import Image from "next/image";
import clsx from "clsx";
import { DoorOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { getRoomPhoto, type Room } from "@/lib/roomsApi";
import type { AsyncState } from "@/lib/useAsyncResource";

interface RoomScheduleSelectorProps {
  state: AsyncState<Room[]>;
  selectedRoomId: string | null;
  onSelect: (room: Room) => void;
  onRetry: () => void;
}

function RoomOptionSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-2.5 rounded-room-card border border-border bg-card p-2">
      <div className="size-14 shrink-0 rounded-[8px] bg-background" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/3 rounded bg-background" />
        <div className="h-3 w-1/2 rounded bg-background" />
      </div>
    </div>
  );
}

export function RoomScheduleSelector({
  state,
  selectedRoomId,
  onSelect,
  onRetry,
}: RoomScheduleSelectorProps) {
  return (
    <Card>
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-widget-title text-heading">Rooms</h2>
        <p className="text-room-meta text-muted">
          Tap a room to load its schedule.
        </p>
      </div>

      {state.status === "loading" ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <RoomOptionSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {state.status === "error" ? (
        <ErrorState message={state.message} onRetry={onRetry} />
      ) : null}

      {state.status === "success" && state.data.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No rooms yet"
          description="The list of meeting rooms will appear once they're added."
        />
      ) : null}

      {state.status === "success" && state.data.length > 0 ? (
        <div className="flex flex-col gap-2">
          {state.data.map((room, index) => {
            const selected = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelect(room)}
                aria-pressed={selected}
                className={clsx(
                  "flex min-h-11 items-center gap-2.5 rounded-room-card border p-2 text-left transition-colors",
                  selected
                    ? "border-accent bg-grid-today"
                    : "border-border bg-card hover:border-accent/60",
                )}
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-[8px]">
                  <Image
                    src={getRoomPhoto(index)}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate text-room-name text-heading">
                    {room.name}
                  </p>
                  <p className="text-room-meta text-muted">
                    {room.capacity} people · {room.floor} floor
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}
