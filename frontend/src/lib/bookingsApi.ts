import { request } from "./api";

export interface MyBooking {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  room: { id: string; name: string };
}

export async function listMyUpcomingBookings(limit = 1): Promise<MyBooking[]> {
  const { bookings } = await request<{ bookings: MyBooking[] }>(
    `/bookings/me?section=upcoming&limit=${limit}`,
    { method: "GET" },
  );
  return bookings;
}

export interface CreateBookingInput {
  roomId: string;
  title: string;
  startAt: Date;
  endAt: Date;
}

export interface CreatedBooking {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  roomId: string;
  userId: string;
}

export async function createBooking(input: CreateBookingInput): Promise<CreatedBooking> {
  const { booking } = await request<{ booking: CreatedBooking }>("/bookings", {
    method: "POST",
    body: {
      roomId: input.roomId,
      title: input.title,
      startAt: input.startAt.toISOString(),
      endAt: input.endAt.toISOString(),
    },
  });
  return booking;
}
