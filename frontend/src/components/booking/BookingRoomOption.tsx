import Image from "next/image";
import clsx from "clsx";
import { getRoomPhoto, type Room } from "@/lib/roomsApi";

interface BookingRoomOptionProps {
  room: Room;
  roomIndex: number;
  available: boolean;
  reason?: string;
  selected: boolean;
  onSelect: () => void;
}

export function BookingRoomOption({
  room,
  roomIndex,
  available,
  reason,
  selected,
  onSelect,
}: BookingRoomOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!available}
      aria-pressed={selected}
      className={clsx(
        "flex min-h-11 w-full items-center gap-3 rounded-room-card border p-2.5 text-left transition-colors",
        selected
          ? "border-accent bg-grid-today"
          : available
            ? "border-grid-border bg-card hover:border-accent/60"
            : "cursor-not-allowed border-grid-border bg-background opacity-60",
      )}
    >
      <div className="relative size-[62px] shrink-0 overflow-hidden rounded-[8px]">
        <Image src={getRoomPhoto(roomIndex)} alt="" fill sizes="62px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-room-name text-heading">{room.name}</p>
        <p className="truncate text-room-meta text-muted">
          {available ? `${room.capacity} people · ${room.floor} floor` : (reason ?? "Unavailable")}
        </p>
      </div>
    </button>
  );
}
