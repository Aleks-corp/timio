import { DoorOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { Room, RoomAvailability } from "@/lib/roomsApi";
import type { AsyncState } from "@/lib/useAsyncResource";
import { BookingRoomOption } from "./BookingRoomOption";

interface BookingRoomListProps {
  rooms: Room[];
  state: AsyncState<RoomAvailability[]>;
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
  onRetry: () => void;
}

function BookingRoomOptionSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-room-card border border-grid-border bg-card p-2.5">
      <div className="size-[62px] shrink-0 rounded-[8px] bg-background" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/3 rounded bg-background" />
        <div className="h-3 w-1/2 rounded bg-background" />
      </div>
    </div>
  );
}

export function BookingRoomList({ rooms, state, selectedRoomId, onSelect, onRetry }: BookingRoomListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-room-name text-heading">Rooms for this slot</h3>
        <p className="text-room-meta text-muted">Available rooms can be selected.</p>
      </div>

      {state.status === "loading" ? (
        <div className="flex flex-col gap-2">
          {rooms.slice(0, 3).map((room) => (
            <BookingRoomOptionSkeleton key={room.id} />
          ))}
        </div>
      ) : null}

      {state.status === "error" ? <ErrorState message={state.message} onRetry={onRetry} /> : null}

      {state.status === "success" && state.data.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="No rooms available"
          description="There are no rooms to check for this time slot."
        />
      ) : null}

      {state.status === "success" && state.data.length > 0 ? (
        <>
          {state.data.every((entry) => !entry.available) ? (
            <p className="text-room-meta text-muted">No rooms are free for this time. Try a different slot.</p>
          ) : null}
          <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
            {state.data.map((entry) => (
              <BookingRoomOption
                key={entry.room.id}
                room={entry.room}
                roomIndex={rooms.findIndex((room) => room.id === entry.room.id)}
                available={entry.available}
                reason={entry.reason}
                selected={entry.room.id === selectedRoomId}
                onSelect={() => onSelect(entry.room.id)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
