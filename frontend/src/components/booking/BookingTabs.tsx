"use client";

import clsx from "clsx";
import type { MyBookingsSection } from "@/lib/bookingsApi";

interface BookingTabsProps {
  active: MyBookingsSection;
  onChange: (section: MyBookingsSection) => void;
}

const TABS: { value: MyBookingsSection; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export function BookingTabs({ active, onChange }: BookingTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-button bg-background p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          aria-pressed={active === tab.value}
          className={clsx(
            "flex h-11 min-w-[100px] items-center justify-center rounded-[6px] px-4 text-room-name transition-colors",
            active === tab.value ? "bg-card text-heading shadow-widget" : "text-muted hover:text-heading",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
