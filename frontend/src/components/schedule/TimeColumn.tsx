import {
  formatTimeInZone,
  GRID_TOTAL_MINUTES,
  type OfficeDayRange,
} from "@/lib/officeTime";
import { getGridPixelHeight } from "@/lib/scheduleLayout";
import { DAY_HEADER_HEIGHT, TIME_COLUMN_WIDTH } from "./gridConstants";

interface TimeColumnProps {
  dayRange: OfficeDayRange;
  timeZone: string;
  pxPerMinute: number;
}

export function TimeColumn({
  dayRange,
  timeZone,
  pxPerMinute,
}: TimeColumnProps) {
  const rowCount = GRID_TOTAL_MINUTES / 60;
  const marks = Array.from(
    { length: rowCount },
    (_, i) => new Date(dayRange.start.getTime() + i * 60 * 60000),
  );

  return (
    <div
      className="sticky left-0 z-10 shrink-0 bg-background"
      style={{ width: TIME_COLUMN_WIDTH }}
    >
      <div style={{ height: DAY_HEADER_HEIGHT }} aria-hidden />
      <div
        className="relative"
        style={{ height: getGridPixelHeight(pxPerMinute) }}
      >
        {marks.map((mark, i) => (
          <div
            key={i}
            className="absolute inset-x-0 border-t border-grid-border px-2 pt-1 text-caption text-grid-muted"
            style={{ top: i * 60 * pxPerMinute }}
          >
            {formatTimeInZone(mark, timeZone)}
          </div>
        ))}
      </div>
    </div>
  );
}
