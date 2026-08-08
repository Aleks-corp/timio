"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { FormError } from "@/components/ui/FormError";
import { cancelBooking, type MyBooking } from "@/lib/bookingsApi";
import { formatBookingDateLabel, formatBookingTimeRangeLabel, resolveCancelError } from "@/lib/bookingUtils";

interface CancelBookingDialogProps {
  booking: MyBooking;
  timeZone: string;
  onClose: () => void;
  onCancelled: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function CancelBookingDialog({ booking, timeZone, onClose, onCancelled }: CancelBookingDialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingRefresh, setPendingRefresh] = useState(false);

  const startAt = new Date(booking.startAt);
  const endAt = new Date(booking.endAt);

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

  useEffect(() => {
    if (!pendingRefresh) return;
    const timeout = setTimeout(onCancelled, 1400);
    return () => clearTimeout(timeout);
  }, [pendingRefresh, onCancelled]);

  async function handleConfirm() {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await cancelBooking(booking.id);
      onCancelled();
    } catch (error) {
      const presentation = resolveCancelError(error);
      setSubmitError(presentation.message);
      if (presentation.shouldRefreshList) {
        setPendingRefresh(true);
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:flex-row lg:items-center lg:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full flex-col rounded-t-[24px] bg-card p-5 shadow-widget lg:max-w-[420px] lg:rounded-widget"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-widget-title text-heading">
            Cancel booking?
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 shrink-0 items-center justify-center rounded-button text-muted transition-colors hover:bg-background hover:text-heading"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-1 rounded-room-card border border-grid-border bg-background p-3">
          <p className="text-room-name text-heading">{booking.title}</p>
          <p className="text-room-meta text-muted">{booking.room.name}</p>
          <p className="text-room-meta text-muted">
            {formatBookingDateLabel(startAt, timeZone)} · {formatBookingTimeRangeLabel(startAt, endAt, timeZone)}
          </p>
        </div>

        {submitError ? (
          <div className="mb-4">
            <FormError message={submitError} />
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || pendingRefresh}
            className="flex h-11 flex-1 items-center justify-center rounded-button bg-background text-room-name text-heading transition-colors hover:bg-grid-today disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || pendingRefresh}
            aria-busy={isSubmitting}
            className="flex h-11 flex-1 items-center justify-center rounded-button bg-cancel-text text-room-name text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Cancelling…" : "Confirm cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}
