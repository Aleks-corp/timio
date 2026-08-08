import { request } from "./api";

export interface MyBooking {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  room: { id: string; name: string };
}

export type MyBookingsSection = "upcoming" | "past";

export interface ListMyBookingsParams {
  section: MyBookingsSection;
  limit: number;
  offset: number;
}

export async function listMyBookings(params: ListMyBookingsParams): Promise<MyBooking[]> {
  const query = new URLSearchParams({
    section: params.section,
    limit: String(params.limit),
    offset: String(params.offset),
  });
  const { bookings } = await request<{ bookings: MyBooking[] }>(
    `/bookings/me?${query.toString()}`,
    { method: "GET" },
  );
  return bookings;
}

export async function listMyUpcomingBookings(limit = 1): Promise<MyBooking[]> {
  return listMyBookings({ section: "upcoming", limit, offset: 0 });
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await request<void>(`/bookings/${bookingId}`, { method: "DELETE" });
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
