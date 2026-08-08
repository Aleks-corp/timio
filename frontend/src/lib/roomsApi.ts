import { request } from "./api";

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
}

export async function listRooms(): Promise<Room[]> {
  const { rooms } = await request<{ rooms: Room[] }>("/rooms", {
    method: "GET",
  });
  return rooms;
}

export interface RoomWeekBookingUser {
  name: string;
}

export interface RoomWeekBooking {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  userId: string;
  user: RoomWeekBookingUser;
}

export interface RoomWeekSchedule {
  weekStart: string;
  weekEnd: string;
  bookings: RoomWeekBooking[];
}

export async function getRoomWeekSchedule(
  roomId: string,
  weekStart: string,
): Promise<RoomWeekSchedule> {
  return request<RoomWeekSchedule>(
    `/rooms/${roomId}/bookings?weekStart=${weekStart}`,
    { method: "GET" },
  );
}

const ROOM_PHOTOS = [
  "/images/rooms/aquarium.jpg",
  "/images/rooms/mars.jpg",
  "/images/rooms/oasis.jpg",
  "/images/rooms/atlas.jpg",
];

export function getRoomPhoto(index: number): string {
  return ROOM_PHOTOS[index % ROOM_PHOTOS.length];
}
