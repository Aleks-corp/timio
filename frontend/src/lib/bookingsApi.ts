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
