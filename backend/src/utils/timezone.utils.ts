import { OFFICE_TIMEZONE } from "../constants/index.js";

function formatOfficeParts(date: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: OFFICE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
}

export function getOfficeDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const parts = formatOfficeParts(date);
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

// Returns the UTC instant for a given wall-clock date/time in the office timezone.
// DST-safe: reads back the guess in the office timezone and corrects for the offset.
export function officeWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const readBack = getOfficeDateParts(utcGuess);
  const readBackAsUtc = Date.UTC(
    readBack.year,
    readBack.month - 1,
    readBack.day,
    readBack.hour,
    readBack.minute,
  );
  const offsetMs = readBackAsUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offsetMs);
}

// Monday 00:00 in the office timezone, for the week containing `reference` (defaults to now).
export function getWeekStartUtc(reference: Date = new Date()): Date {
  const { year, month, day } = getOfficeDateParts(reference);
  const anchor = new Date(Date.UTC(year, month - 1, day));
  const weekday = anchor.getUTCDay() || 7; // Monday=1 .. Sunday=7
  anchor.setUTCDate(anchor.getUTCDate() - weekday + 1);
  return officeWallTimeToUtc(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, anchor.getUTCDate());
}

// `days` after `instant`, keeping the same office-timezone wall-clock time (DST-safe).
export function addDaysUtc(instant: Date, days: number): Date {
  const { year, month, day, hour, minute } = getOfficeDateParts(instant);
  const anchor = new Date(Date.UTC(year, month - 1, day));
  anchor.setUTCDate(anchor.getUTCDate() + days);
  return officeWallTimeToUtc(
    anchor.getUTCFullYear(),
    anchor.getUTCMonth() + 1,
    anchor.getUTCDate(),
    hour,
    minute,
  );
}
