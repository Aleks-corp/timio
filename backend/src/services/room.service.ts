import { prisma } from "../lib/index.js";
import { HttpError } from "../utils/index.js";
import type { RoomModel } from "../generated/prisma/models.js";
import type { PublicRoom } from "../types/index.js";

function toPublicRoom(room: RoomModel): PublicRoom {
  return {
    id: room.id,
    name: room.name,
    floor: room.floor,
    capacity: room.capacity,
    amenities: room.amenities,
  };
}

export async function listRooms(minCapacity?: number): Promise<PublicRoom[]> {
  const rooms = await prisma.room.findMany({
    where: minCapacity !== undefined ? { capacity: { gte: minCapacity } } : undefined,
    orderBy: { name: "asc" },
  });
  return rooms.map(toPublicRoom);
}

export async function getRoomOrThrow(roomId: string): Promise<RoomModel> {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    throw HttpError(404, "Room not found");
  }
  return room;
}
