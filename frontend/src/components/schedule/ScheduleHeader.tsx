import Image from "next/image";
import { getRoomPhoto, type Room } from "@/lib/roomsApi";

interface ScheduleHeaderProps {
  room: Room;
  roomIndex: number;
}

export function ScheduleHeader({ room, roomIndex }: ScheduleHeaderProps) {
  return (
    <div className="flex items-center gap-3 rounded-widget bg-card p-3 shadow-widget sm:gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-[8px] sm:size-20">
        <Image
          src={getRoomPhoto(roomIndex)}
          alt=""
          fill
          sizes="80px"
          className="object-cover"
          priority
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-eyebrow uppercase text-muted">Selected room</p>
        <p className="truncate text-widget-title text-heading">{room.name}</p>
        <p className="text-room-meta text-muted">
          {room.floor} floor · up to {room.capacity} people
        </p>
      </div>
    </div>
  );
}
