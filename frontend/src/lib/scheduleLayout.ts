import { type OfficeDayRange, GRID_TOTAL_MINUTES } from "./officeTime";

const MIN_BLOCK_HEIGHT_MINUTES = 15;

export function getMinutesFromWorkdayStart(
  instant: Date,
  dayRange: OfficeDayRange,
): number {
  return (instant.getTime() - dayRange.start.getTime()) / 60000;
}

export function isBookingVisibleInDay(
  startAt: Date,
  endAt: Date,
  dayRange: OfficeDayRange,
): boolean {
  return (
    startAt.getTime() < dayRange.end.getTime() &&
    endAt.getTime() > dayRange.start.getTime()
  );
}

export function getBookingBlockTop(
  startAt: Date,
  dayRange: OfficeDayRange,
  pxPerMinute: number,
): number {
  const clampedStart = Math.max(startAt.getTime(), dayRange.start.getTime());
  const minutes = getMinutesFromWorkdayStart(new Date(clampedStart), dayRange);
  return minutes * pxPerMinute;
}

export function getBookingBlockHeight(
  startAt: Date,
  endAt: Date,
  dayRange: OfficeDayRange,
  pxPerMinute: number,
): number {
  const clampedStart = Math.max(startAt.getTime(), dayRange.start.getTime());
  const clampedEnd = Math.min(endAt.getTime(), dayRange.end.getTime());
  const durationMinutes = Math.max(
    (clampedEnd - clampedStart) / 60000,
    MIN_BLOCK_HEIGHT_MINUTES,
  );
  return durationMinutes * pxPerMinute;
}

export function getGridPixelHeight(pxPerMinute: number): number {
  return GRID_TOTAL_MINUTES * pxPerMinute;
}

export function getNowLineTop(
  now: Date,
  dayRange: OfficeDayRange,
  pxPerMinute: number,
): number | null {
  if (
    now.getTime() < dayRange.start.getTime() ||
    now.getTime() > dayRange.end.getTime()
  )
    return null;
  return getMinutesFromWorkdayStart(now, dayRange) * pxPerMinute;
}
