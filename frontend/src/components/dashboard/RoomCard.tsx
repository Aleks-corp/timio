import Image from "next/image";
import Link from "next/link";
import { getRoomPhoto, type Room } from "@/lib/roomsApi";

interface RoomCardProps {
  room: Room;
  index: number;
}

export function RoomCard({ room, index }: RoomCardProps) {
  const photo = getRoomPhoto(index);

  return (
    <Link
      href={`/dashboard/rooms/${room.id}`}
      className="flex items-center gap-2.5 rounded-room-card border border-border bg-card p-2 transition-colors hover:border-accent"
    >
      <div className="relative size-[86px] shrink-0 overflow-hidden rounded-[8px]">
        <Image
          src={photo}
          alt=""
          fill
          sizes="86px"
          className="object-cover"
          priority={index === 0}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-room-name text-heading">{room.name}</p>
        <p className="text-room-meta text-muted">
          {room.capacity} people · {room.floor} floor
        </p>
      </div>
    </Link>
  );
}
