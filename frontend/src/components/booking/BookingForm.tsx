"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle2 } from "lucide-react";
import { FormError } from "@/components/ui/FormError";
import { Select, type SelectOption } from "@/components/ui/Select";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validation";
import { checkRoomsAvailability, type Room } from "@/lib/roomsApi";
import { createBooking } from "@/lib/bookingsApi";
import { useAsyncResource } from "@/lib/useAsyncResource";
import { OFFICE_TIMEZONE, addDaysInZone, formatDateKey, formatTimeInZone, getOfficeDayRange } from "@/lib/officeTime";
import {
  DURATION_OPTIONS_MINUTES,
  formatDurationLabel,
  getEndAt,
  isStartInPast,
  isWithinOfficeHours,
  resolveBookingSubmitError,
} from "@/lib/bookingUtils";
import { BookingRoomList } from "./BookingRoomList";

const weekdayDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: OFFICE_TIMEZONE,
});

const START_MARK_COUNT = 20;

interface BookingFormProps {
  rooms: Room[];
  initialRoomId: string;
  initialStartAt: Date;
  defaultDurationMinutes: number;
  weekStart: Date;
  timeZone: string;
  onSuccess: () => void;
  onCancel: () => void;
  onBookingConflict: () => void;
}

export function BookingForm({
  rooms,
  initialRoomId,
  initialStartAt,
  defaultDurationMinutes,
  weekStart,
  timeZone,
  onSuccess,
  onCancel,
  onBookingConflict,
}: BookingFormProps) {
  const [dayKey, setDayKey] = useState(() => formatDateKey(initialStartAt, OFFICE_TIMEZONE));
  const [startMinutes, setStartMinutes] = useState(() => {
    const range = getOfficeDayRange(initialStartAt);
    const minutes = Math.round((initialStartAt.getTime() - range.start.getTime()) / 60000);
    return Math.min(Math.max(minutes, 0), (START_MARK_COUNT - 1) * 30);
  });
  const [durationMinutes, setDurationMinutes] = useState(defaultDurationMinutes);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRoomId);
  const [availabilityRetryToken, setAvailabilityRetryToken] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isSubmittingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: yupResolver(bookingFormSchema),
    defaultValues: { title: "", notes: "" },
  });

  const dayOptions: SelectOption[] = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDaysInZone(weekStart, index, OFFICE_TIMEZONE);
        return { value: formatDateKey(date, OFFICE_TIMEZONE), label: weekdayDateFormatter.format(date) };
      }),
    [weekStart],
  );

  const selectedDayIndex = dayOptions.findIndex((option) => option.value === dayKey);
  const selectedDayDate = addDaysInZone(weekStart, selectedDayIndex >= 0 ? selectedDayIndex : 0, OFFICE_TIMEZONE);
  const dayRange = useMemo(() => getOfficeDayRange(selectedDayDate), [selectedDayDate]);

  const startOptions: SelectOption[] = useMemo(
    () =>
      Array.from({ length: START_MARK_COUNT }, (_, index) => {
        const instant = new Date(dayRange.start.getTime() + index * 30 * 60000);
        return { value: String(index * 30), label: formatTimeInZone(instant, timeZone) };
      }),
    [dayRange, timeZone],
  );

  const durationOptions: SelectOption[] = useMemo(
    () =>
      DURATION_OPTIONS_MINUTES.map((minutes) => ({
        value: String(minutes),
        label: formatDurationLabel(minutes),
      })),
    [],
  );

  const startAt = useMemo(() => new Date(dayRange.start.getTime() + startMinutes * 60000), [dayRange, startMinutes]);
  const endAt = useMemo(() => getEndAt(startAt, durationMinutes), [startAt, durationMinutes]);

  const availabilityState = useAsyncResource(
    () => checkRoomsAvailability(rooms, startAt, endAt),
    [rooms, startAt.getTime(), endAt.getTime(), availabilityRetryToken],
  );

  const availableRoomIds =
    availabilityState.status === "success"
      ? availabilityState.data.filter((entry) => entry.available).map((entry) => entry.room.id)
      : [];

  const effectiveRoomId =
    selectedRoomId !== null && availableRoomIds.includes(selectedRoomId)
      ? selectedRoomId
      : (availableRoomIds[0] ?? null);

  const isConfirmDisabled = isSubmitting || availabilityState.status === "loading" || effectiveRoomId === null;

  useEffect(() => {
    if (!showSuccess) return;
    const timeout = setTimeout(onSuccess, 900);
    return () => clearTimeout(timeout);
  }, [showSuccess, onSuccess]);

  async function onSubmit(values: BookingFormValues) {
    if (isSubmittingRef.current || effectiveRoomId === null) return;

    if (isStartInPast(startAt)) {
      setSubmitError("This time has already passed. Pick a future slot.");
      return;
    }
    if (!isWithinOfficeHours(startAt, endAt)) {
      setSubmitError("Bookings must fit within office hours, 09:00–19:00 Kyiv time.");
      return;
    }

    isSubmittingRef.current = true;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createBooking({
        roomId: effectiveRoomId,
        title: values.title.trim(),
        startAt,
        endAt,
      });
      setShowSuccess(true);
    } catch (error) {
      const presentation = resolveBookingSubmitError(error);
      setSubmitError(presentation.message);
      if (presentation.shouldRefreshAvailability) {
        setAvailabilityRetryToken((token) => token + 1);
        onBookingConflict();
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-booking-mine text-white">
          <CheckCircle2 size={22} aria-hidden />
        </div>
        <p className="text-room-name text-heading">Booking confirmed</p>
        <p className="max-w-xs text-room-meta text-muted">
          {formatTimeInZone(startAt, timeZone)}–{formatTimeInZone(endAt, timeZone)}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      noValidate
      className="flex flex-col gap-5"
    >
      <p className="text-room-meta text-muted">
        {availabilityState.status === "success"
          ? `${availableRoomIds.length} available room${availableRoomIds.length === 1 ? "" : "s"}`
          : "Checking availability…"}
        {" · time shown in your local timezone"}
      </p>

      <div className="grid grid-cols-3 gap-2.5">
        <Select label="Day" options={dayOptions} value={dayKey} onChange={(event) => setDayKey(event.target.value)} />
        <Select
          label="Start"
          options={startOptions}
          value={String(startMinutes)}
          onChange={(event) => setStartMinutes(Number(event.target.value))}
        />
        <Select
          label="Duration"
          options={durationOptions}
          value={String(durationMinutes)}
          onChange={(event) => setDurationMinutes(Number(event.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="booking-title" className="text-label text-strong">
          Meeting title
        </label>
        <input
          id="booking-title"
          type="text"
          placeholder="e.g. Design review"
          aria-invalid={Boolean(errors.title)}
          className="h-11 rounded-input border border-border bg-input px-4 font-inter text-sm text-strong outline-none transition-colors placeholder:text-muted-light focus:border-accent"
          {...register("title")}
        />
        {errors.title ? (
          <p role="alert" className="text-caption text-error">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="booking-notes" className="text-label text-strong">
          Notes
        </label>
        <textarea
          id="booking-notes"
          placeholder="Optional context for the booking"
          rows={3}
          aria-invalid={Boolean(errors.notes)}
          className="min-h-[88px] rounded-input border border-border bg-input px-4 py-3 font-inter text-sm text-strong outline-none transition-colors placeholder:text-muted-light focus:border-accent"
          {...register("notes")}
        />
        {errors.notes ? (
          <p role="alert" className="text-caption text-error">
            {errors.notes.message}
          </p>
        ) : null}
      </div>

      <BookingRoomList
        rooms={rooms}
        state={availabilityState}
        selectedRoomId={effectiveRoomId}
        onSelect={setSelectedRoomId}
        onRetry={() => setAvailabilityRetryToken((token) => token + 1)}
      />

      {submitError ? <FormError message={submitError} /> : null}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-11 flex-1 items-center justify-center rounded-button bg-background text-room-name text-heading transition-colors hover:bg-grid-today"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isConfirmDisabled}
          aria-busy={isSubmitting}
          className="flex h-11 flex-1 items-center justify-center rounded-button bg-gradient-to-b from-accent-from to-accent-to text-room-name text-white shadow-widget transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Booking…" : "Confirm booking"}
        </button>
      </div>
    </form>
  );
}
