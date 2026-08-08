import { OFFICE_TIMEZONE, formatTimeZoneLabel, isSameTimeZone } from "@/lib/officeTime";

interface TimezoneNoticeProps {
  timeZone: string;
}

export function TimezoneNotice({ timeZone }: TimezoneNoticeProps) {
  if (isSameTimeZone(timeZone, OFFICE_TIMEZONE)) return null;

  return (
    <div className="rounded-[8px] border border-border bg-card px-3 py-2 text-caption text-muted">
      Showing your time ({formatTimeZoneLabel(timeZone)}) · office schedule is validated in{" "}
      {formatTimeZoneLabel(OFFICE_TIMEZONE)} time.
    </div>
  );
}
