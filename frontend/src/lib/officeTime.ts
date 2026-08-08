export const OFFICE_TIMEZONE = "Europe/Kyiv";
export const GRID_START_MINUTES = 9 * 60;
export const GRID_END_MINUTES = 19 * 60;
export const GRID_TOTAL_MINUTES = GRID_END_MINUTES - GRID_START_MINUTES;

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function getDateParts(date: Date, timeZone: string): DateParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
  };
}

function wallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const readBack = getDateParts(utcGuess, timeZone);
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

export function getMondayOfWeek(
  reference: Date,
  timeZone: string = OFFICE_TIMEZONE,
): Date {
  const { year, month, day } = getDateParts(reference, timeZone);
  const anchor = new Date(Date.UTC(year, month - 1, day));
  const weekday = anchor.getUTCDay() || 7; // Monday=1 .. Sunday=7
  anchor.setUTCDate(anchor.getUTCDate() - weekday + 1);
  return wallTimeToUtc(
    anchor.getUTCFullYear(),
    anchor.getUTCMonth() + 1,
    anchor.getUTCDate(),
    0,
    0,
    timeZone,
  );
}

export function addDaysInZone(
  instant: Date,
  days: number,
  timeZone: string = OFFICE_TIMEZONE,
): Date {
  const { year, month, day, hour, minute } = getDateParts(instant, timeZone);
  const anchor = new Date(Date.UTC(year, month - 1, day));
  anchor.setUTCDate(anchor.getUTCDate() + days);
  return wallTimeToUtc(
    anchor.getUTCFullYear(),
    anchor.getUTCMonth() + 1,
    anchor.getUTCDate(),
    hour,
    minute,
    timeZone,
  );
}

export interface OfficeDayRange {
  start: Date;
  end: Date;
}

export function getOfficeDayRange(dayInstant: Date): OfficeDayRange {
  const { year, month, day } = getDateParts(dayInstant, OFFICE_TIMEZONE);
  const start = wallTimeToUtc(
    year,
    month,
    day,
    Math.floor(GRID_START_MINUTES / 60),
    GRID_START_MINUTES % 60,
    OFFICE_TIMEZONE,
  );
  const end = wallTimeToUtc(
    year,
    month,
    day,
    Math.floor(GRID_END_MINUTES / 60),
    GRID_END_MINUTES % 60,
    OFFICE_TIMEZONE,
  );
  return { start, end };
}

export function isWithinWeek(date: Date, weekStart: Date): boolean {
  const weekEnd = addDaysInZone(weekStart, 7);
  return (
    date.getTime() >= weekStart.getTime() && date.getTime() < weekEnd.getTime()
  );
}

export function isSameDayInZone(a: Date, b: Date, timeZone: string): boolean {
  const partsA = getDateParts(a, timeZone);
  const partsB = getDateParts(b, timeZone);
  return (
    partsA.year === partsB.year &&
    partsA.month === partsB.month &&
    partsA.day === partsB.day
  );
}

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateKey(
  key: string,
): { year: number; month: number; day: number } | null {
  const match = DATE_KEY_PATTERN.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function isMondayDateKey(key: string): boolean {
  const parts = parseDateKey(key);
  if (!parts) return false;
  return (
    new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay() === 1
  );
}

export function dateKeyToOfficeMidnight(key: string): Date | null {
  const parts = parseDateKey(key);
  if (!parts) return null;
  return wallTimeToUtc(
    parts.year,
    parts.month,
    parts.day,
    0,
    0,
    OFFICE_TIMEZONE,
  );
}

export function formatDateKey(
  date: Date,
  timeZone: string = OFFICE_TIMEZONE,
): string {
  const { year, month, day } = getDateParts(date, timeZone);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function isSameTimeZone(a: string, b: string): boolean {
  if (a === b) return true;
  try {
    const probe = new Date();
    const partsA = getDateParts(probe, a);
    const partsB = getDateParts(probe, b);
    return (
      partsA.year === partsB.year &&
      partsA.month === partsB.month &&
      partsA.day === partsB.day &&
      partsA.hour === partsB.hour &&
      partsA.minute === partsB.minute
    );
  } catch {
    return false;
  }
}

export function formatTimeZoneLabel(timeZone: string): string {
  const city = timeZone.split("/").pop() ?? timeZone;
  return city.replace(/_/g, " ");
}

const timeFormatterCache = new Map<string, Intl.DateTimeFormat>();

export function formatTimeInZone(date: Date, timeZone: string): string {
  let formatter = timeFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    timeFormatterCache.set(timeZone, formatter);
  }
  return formatter.format(date);
}

export function formatWeekRangeLabel(
  weekStart: Date,
  timeZone: string = OFFICE_TIMEZONE,
): string {
  const weekEndInclusive = addDaysInZone(weekStart, 6, timeZone);
  const startParts = getDateParts(weekStart, timeZone);
  const endParts = getDateParts(weekEndInclusive, timeZone);
  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
  });
  const startMonth = monthFormatter.format(weekStart);
  const endMonth = monthFormatter.format(weekEndInclusive);

  if (startParts.year !== endParts.year) {
    return `${startMonth} ${startParts.day}, ${startParts.year} – ${endMonth} ${endParts.day}, ${endParts.year}`;
  }
  if (startMonth !== endMonth) {
    return `${startMonth} ${startParts.day} – ${endMonth} ${endParts.day}, ${endParts.year}`;
  }
  return `${startMonth} ${startParts.day}–${endParts.day}, ${endParts.year}`;
}
