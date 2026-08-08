"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { formatTimeInZone } from "@/lib/officeTime";
import type { Room } from "@/lib/roomsApi";
import { BookingForm } from "./BookingForm";

interface BookingDrawerProps {
  rooms: Room[];
  roomId: string;
  startAt: Date;
  defaultDurationMinutes: number;
  weekStart: Date;
  timeZone: string;
  onClose: () => void;
  onCreated: () => void;
  onBookingConflict: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function BookingDrawer({
  rooms,
  roomId,
  startAt,
  defaultDurationMinutes,
  weekStart,
  timeZone,
  onClose,
  onCreated,
  onBookingConflict,
}: BookingDrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const initialFocusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    initialFocusable?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:flex-row lg:justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[92vh] w-full flex-col rounded-t-[24px] bg-card shadow-widget lg:h-full lg:max-w-[430px] lg:rounded-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-grid-border p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <p className="text-eyebrow uppercase text-muted">Create booking</p>
            <h2 id={titleId} className="text-widget-title text-heading">
              {formatTimeInZone(startAt, timeZone)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 shrink-0 items-center justify-center rounded-button text-muted transition-colors hover:bg-background hover:text-heading"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <BookingForm
            rooms={rooms}
            initialRoomId={roomId}
            initialStartAt={startAt}
            defaultDurationMinutes={defaultDurationMinutes}
            weekStart={weekStart}
            timeZone={timeZone}
            onSuccess={onCreated}
            onCancel={onClose}
            onBookingConflict={onBookingConflict}
          />
        </div>
      </div>
    </div>
  );
}
