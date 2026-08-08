import { ApiError } from "./api";
import { formatDateKey, formatTimeInZone, getMondayOfWeek, getOfficeDayRange } from "./officeTime";

export const DURATION_OPTIONS_MINUTES = [30, 60, 90, 120, 150, 180, 210, 240];

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  const roundedHours = hours % 1 === 0 ? String(hours) : hours.toFixed(1);
  return `${roundedHours} hour${hours === 1 ? "" : "s"}`;
}

export function getEndAt(startAt: Date, durationMinutes: number): Date {
  return new Date(startAt.getTime() + durationMinutes * 60000);
}

export function isWithinOfficeHours(startAt: Date, endAt: Date): boolean {
  const dayRange = getOfficeDayRange(startAt);
  return startAt.getTime() >= dayRange.start.getTime() && endAt.getTime() <= dayRange.end.getTime();
}

export function isStartInPast(startAt: Date, now: Date = new Date()): boolean {
  return startAt.getTime() <= now.getTime();
}

export interface BookingSubmitErrorPresentation {
  message: string;
  shouldRefreshAvailability: boolean;
}

const bookingDateFormatterCache = new Map<string, Intl.DateTimeFormat>();

export function formatBookingDateLabel(date: Date, timeZone: string): string {
  let formatter = bookingDateFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    bookingDateFormatterCache.set(timeZone, formatter);
  }
  return formatter.format(date);
}

export function formatBookingTimeRangeLabel(startAt: Date, endAt: Date, timeZone: string): string {
  return `${formatTimeInZone(startAt, timeZone)}-${formatTimeInZone(endAt, timeZone)}`;
}

export function getBookingScheduleHref(roomId: string, startAt: Date): string {
  const weekKey = formatDateKey(getMondayOfWeek(startAt));
  const params = new URLSearchParams({ roomId, week: weekKey });
  return `/dashboard/schedule?${params.toString()}`;
}

export interface CancelErrorPresentation {
  message: string;
  shouldRefreshList: boolean;
}

export function resolveCancelError(error: unknown): CancelErrorPresentation {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return { message: "This booking is no longer available.", shouldRefreshList: true };
    }
    if (error.status === 403) {
      return { message: "You can only cancel your own booking.", shouldRefreshList: false };
    }
    if (error.status === 401) {
      return {
        message: "Your session has expired. Sign in again to continue.",
        shouldRefreshList: false,
      };
    }
    if (error.status === 0) {
      return {
        message: "Couldn't reach the server. Check your connection and try again.",
        shouldRefreshList: false,
      };
    }
    return { message: error.message, shouldRefreshList: false };
  }
  return { message: "Something went wrong. Please try again.", shouldRefreshList: false };
}

export function resolveBookingSubmitError(error: unknown): BookingSubmitErrorPresentation {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return { message: error.message, shouldRefreshAvailability: true };
    }
    if (error.status === 401) {
      return {
        message: "Your session has expired. Sign in again to continue.",
        shouldRefreshAvailability: false,
      };
    }
    if (error.status === 0) {
      return {
        message: "Couldn't reach the server. Check your connection and try again.",
        shouldRefreshAvailability: false,
      };
    }
    return { message: error.message, shouldRefreshAvailability: false };
  }
  return { message: "Something went wrong. Please try again.", shouldRefreshAvailability: false };
}
