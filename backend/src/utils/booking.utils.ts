import { getOfficeDateParts } from "./timezone.utils.js";
import {
  MIN_BOOKING_MINUTES,
  MAX_BOOKING_MINUTES,
  OFFICE_OPEN_MINUTES,
  OFFICE_CLOSE_MINUTES,
} from "../constants/index.js";

export function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function isAlignedToSlot(date: Date): boolean {
  return (
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0 &&
    date.getUTCMinutes() % 30 === 0
  );
}

export function getDurationMinutes(startAt: Date, endAt: Date): number {
  return (endAt.getTime() - startAt.getTime()) / 60000;
}

export function isWithinOfficeHours(startAt: Date, endAt: Date): boolean {
  const start = getOfficeDateParts(startAt);
  const end = getOfficeDateParts(endAt);
  const sameDay =
    start.year === end.year && start.month === end.month && start.day === end.day;
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;

  return sameDay && startMinutes >= OFFICE_OPEN_MINUTES && endMinutes <= OFFICE_CLOSE_MINUTES;
}

// Returns a user-facing error message, or null if the window is valid.
// Pure and DB-free on purpose: reused by both booking creation and the
// availability check, and easy to unit test in isolation.
export function getBookingWindowError(startAt: Date, endAt: Date): string | null {
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
    return "Невалідний інтервал бронювання";
  }
  if (!isAlignedToSlot(startAt) || !isAlignedToSlot(endAt)) {
    return "Час має бути кратним 30 хвилинам";
  }
  const duration = getDurationMinutes(startAt, endAt);
  if (duration < MIN_BOOKING_MINUTES || duration > MAX_BOOKING_MINUTES) {
    return "Тривалість бронювання має бути від 30 хвилин до 4 годин";
  }
  if (startAt.getTime() <= Date.now()) {
    return "Час бронювання має бути в майбутньому";
  }
  if (!isWithinOfficeHours(startAt, endAt)) {
    return "Бронювання можливе лише з 09:00 до 19:00 за часом офісу";
  }
  return null;
}
