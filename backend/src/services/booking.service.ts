import { prisma } from "../lib/index.js";
import { Prisma } from "../generated/prisma/client.js";
import type { BookingModel } from "../generated/prisma/models.js";
import { HttpError, getBookingWindowError, getWeekStartUtc, addDaysUtc } from "../utils/index.js";
import { getRoomOrThrow } from "./room.service.js";
import type { PublicBooking, RoomWeekBooking, MyBooking } from "../types/index.js";

function toPublicBooking(booking: BookingModel): PublicBooking {
  return {
    id: booking.id,
    title: booking.title,
    startAt: booking.startAt,
    endAt: booking.endAt,
    roomId: booking.roomId,
    userId: booking.userId,
  };
}

export async function createBooking(input: {
  userId: string;
  roomId: string;
  title: string;
  startAt: Date;
  endAt: Date;
}): Promise<PublicBooking> {
  const { userId, roomId, title, startAt, endAt } = input;

  const windowError = getBookingWindowError(startAt, endAt);
  if (windowError) {
    throw HttpError(400, windowError);
  }

  await getRoomOrThrow(roomId);

  // Atomicity: an advisory lock keyed by roomId, held for the transaction,
  // serializes concurrent booking attempts for the same room so the
  // overlap check and the insert can never race each other. Requests for
  // different rooms take different lock keys and don't block one another.
  const booking = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${roomId}))`;

    const conflict = await tx.booking.findFirst({
      where: { roomId, startAt: { lt: endAt }, endAt: { gt: startAt } },
    });
    if (conflict) {
      throw HttpError(409, "The selected slot is already taken");
    }

    return tx.booking.create({ data: { roomId, userId, title, startAt, endAt } });
  });

  return toPublicBooking(booking);
}

export async function cancelBooking(bookingId: string, userId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    throw HttpError(404, "Booking not found");
  }
  if (booking.userId !== userId) {
    throw HttpError(403, "You can only cancel your own booking");
  }

  try {
    await prisma.booking.delete({ where: { id: bookingId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      // Already deleted by a concurrent request — treat as success from the caller's POV.
      return;
    }
    throw error;
  }
}

export async function getRoomWeekBookings(
  roomId: string,
  weekReference?: Date,
): Promise<{ weekStart: Date; weekEnd: Date; bookings: RoomWeekBooking[] }> {
  await getRoomOrThrow(roomId);

  const weekStart = getWeekStartUtc(weekReference);
  const weekEnd = addDaysUtc(weekStart, 7);

  const bookings = await prisma.booking.findMany({
    where: { roomId, startAt: { lt: weekEnd }, endAt: { gt: weekStart } },
    orderBy: { startAt: "asc" },
    include: { user: { select: { name: true } } },
  });

  return {
    weekStart,
    weekEnd,
    bookings: bookings.map((booking) => ({
      id: booking.id,
      title: booking.title,
      startAt: booking.startAt,
      endAt: booking.endAt,
      userId: booking.userId,
      user: { name: booking.user.name },
    })),
  };
}

export async function checkAvailability(input: {
  roomId: string;
  startAt: Date;
  endAt: Date;
}): Promise<{ available: boolean; reason?: string }> {
  const { roomId, startAt, endAt } = input;

  await getRoomOrThrow(roomId);

  const windowError = getBookingWindowError(startAt, endAt);
  if (windowError) {
    return { available: false, reason: windowError };
  }

  const conflict = await prisma.booking.findFirst({
    where: { roomId, startAt: { lt: endAt }, endAt: { gt: startAt } },
  });

  return conflict ? { available: false, reason: "The selected slot is already taken" } : { available: true };
}

export async function listMyBookings(
  userId: string,
  section: "upcoming" | "past",
  limit: number,
  offset: number,
): Promise<MyBooking[]> {
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      ...(section === "upcoming" ? { endAt: { gt: now } } : { endAt: { lte: now } }),
    },
    orderBy: { startAt: section === "upcoming" ? "asc" : "desc" },
    take: limit,
    skip: offset,
    include: { room: { select: { id: true, name: true } } },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    title: booking.title,
    startAt: booking.startAt,
    endAt: booking.endAt,
    room: booking.room,
  }));
}
