/**
 * Dynamic date/time helpers for the bay-booking picker. Nothing here is
 * hardcoded to a specific date — everything is generated relative to
 * "now" so it never goes stale.
 */

export type BookingDay = {
  /** ISO date, e.g. 2026-09-16 */
  iso: string;
  /** e.g. TUE */
  weekdayShort: string;
  /** e.g. 16 */
  dayOfMonth: number;
  isToday: boolean;
};

/** The shop books bays Monday–Saturday; Sunday is skipped. */
function isBookableDay(date: Date): boolean {
  return date.getDay() !== 0;
}

/** Next `count` bookable days starting today (today included if still bookable). */
export function getUpcomingBookingDays(count = 5, from: Date = new Date()): BookingDay[] {
  const days: BookingDay[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  while (days.length < count) {
    if (isBookableDay(cursor)) {
      days.push({
        iso: toIsoDate(cursor),
        weekdayShort: cursor.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        dayOfMonth: cursor.getDate(),
        isToday: cursor.getTime() === today.getTime(),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Fixed bay-booking shop time slots. */
export const TIME_SLOTS = [
  "7:00 AM",
  "8:30 AM",
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
] as const;

function slotToMinutes(slot: string): number {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(slot.trim());
  if (!match || !match[1] || !match[2] || !match[3]) return 0;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

/** A slot is unavailable if the selected day is today and the slot's time has passed. */
export function isSlotDisabled(dayIso: string, slot: string, now: Date = new Date()): boolean {
  if (dayIso !== toIsoDate(now)) return dayIso < toIsoDate(now);
  return slotToMinutes(slot) <= now.getHours() * 60 + now.getMinutes();
}

export function formatDateHuman(iso: string): string {
  const parts = iso.split("-").map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
