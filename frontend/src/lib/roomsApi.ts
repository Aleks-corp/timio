import { request } from "./api";

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
}

export async function listRooms(): Promise<Room[]> {
  const { rooms } = await request<{ rooms: Room[] }>("/rooms", { method: "GET" });
  return rooms;
}
