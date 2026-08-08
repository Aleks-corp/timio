import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRangeLabel } from "@/lib/officeTime";

interface WeekNavigationProps {
  weekStart: Date;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekNavigation({ weekStart, isCurrentWeek, onPrevious, onNext, onToday }: WeekNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-room-name text-heading">{formatWeekRangeLabel(weekStart)}</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Previous week"
          className="flex size-11 items-center justify-center rounded-button bg-background text-heading transition-colors hover:bg-grid-today"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onToday}
          disabled={isCurrentWeek}
          aria-label="Go to current week"
          className="flex h-11 items-center justify-center rounded-button bg-background px-4 text-room-name text-heading transition-colors hover:bg-grid-today disabled:cursor-not-allowed disabled:opacity-50"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next week"
          className="flex size-11 items-center justify-center rounded-button bg-background text-heading transition-colors hover:bg-grid-today"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
