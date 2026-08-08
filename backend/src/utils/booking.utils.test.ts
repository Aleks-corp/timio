import { test } from "node:test";
import assert from "node:assert/strict";
import { intervalsOverlap, isAlignedToSlot, getBookingWindowError } from "./booking.utils.js";

const d = (iso: string) => new Date(iso);

test("intervalsOverlap: back-to-back bookings do not conflict", () => {
  assert.equal(
    intervalsOverlap(d("2026-08-03T10:00:00Z"), d("2026-08-03T11:00:00Z"), d("2026-08-03T11:00:00Z"), d("2026-08-03T12:00:00Z")),
    false,
  );
});

test("intervalsOverlap: partial overlap conflicts", () => {
  assert.equal(
    intervalsOverlap(d("2026-08-03T10:00:00Z"), d("2026-08-03T11:00:00Z"), d("2026-08-03T10:30:00Z"), d("2026-08-03T11:30:00Z")),
    true,
  );
});

test("intervalsOverlap: identical intervals conflict", () => {
  assert.equal(
    intervalsOverlap(d("2026-08-03T10:00:00Z"), d("2026-08-03T11:00:00Z"), d("2026-08-03T10:00:00Z"), d("2026-08-03T11:00:00Z")),
    true,
  );
});

test("intervalsOverlap: same time window on adjacent days does not conflict", () => {
  assert.equal(
    intervalsOverlap(d("2026-08-03T10:00:00Z"), d("2026-08-03T11:00:00Z"), d("2026-08-04T10:00:00Z"), d("2026-08-04T11:00:00Z")),
    false,
  );
});

test("intervalsOverlap: one interval fully containing another conflicts", () => {
  assert.equal(
    intervalsOverlap(d("2026-08-03T09:00:00Z"), d("2026-08-03T12:00:00Z"), d("2026-08-03T10:00:00Z"), d("2026-08-03T11:00:00Z")),
    true,
  );
});

test("isAlignedToSlot: accepts exact 30-minute marks", () => {
  assert.equal(isAlignedToSlot(d("2026-08-03T10:00:00.000Z")), true);
  assert.equal(isAlignedToSlot(d("2026-08-03T10:30:00.000Z")), true);
});

test("isAlignedToSlot: rejects off-grid minutes/seconds", () => {
  assert.equal(isAlignedToSlot(d("2026-08-03T10:15:00.000Z")), false);
  assert.equal(isAlignedToSlot(d("2026-08-03T10:00:05.000Z")), false);
});

test("getBookingWindowError: rejects a window outside office hours (Kyiv)", () => {
  // 20:00-21:00 Kyiv (UTC+3 in August) is past the 19:00 close.
  const startAt = d("2026-08-03T17:00:00.000Z");
  const endAt = d("2026-08-03T18:00:00.000Z");
  assert.match(getBookingWindowError(startAt, endAt) ?? "", /09:00.*19:00/);
});

test("getBookingWindowError: rejects a window in the past", () => {
  const startAt = new Date();
  startAt.setUTCMinutes(startAt.getUTCMinutes() < 30 ? 0 : 30, 0, 0);
  startAt.setTime(startAt.getTime() - 60 * 60 * 1000); // 1h in the past, still 30-min aligned
  const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);
  assert.match(getBookingWindowError(startAt, endAt) ?? "", /future/);
});

test("getBookingWindowError: rejects a duration over 4 hours", () => {
  const startAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  startAt.setUTCHours(10, 0, 0, 0);
  const endAt = new Date(startAt.getTime() + 5 * 60 * 60 * 1000); // 5h, still 30-min aligned
  assert.match(getBookingWindowError(startAt, endAt) ?? "", /30 minutes and 4 hours/);
});

test("getBookingWindowError: accepts a valid future in-hours window", () => {
  const startAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  startAt.setUTCMinutes(0, 0, 0);
  // Anchor to a safe mid-day UTC hour so the Kyiv-local check stays within 09:00-19:00.
  startAt.setUTCHours(10, 0, 0, 0);
  const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);
  assert.equal(getBookingWindowError(startAt, endAt), null);
});
