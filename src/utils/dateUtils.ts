// Date helpers for Streak75.
//
// THE INCLUSIVE CONVENTION (important):
// A challenge of N days is counted *inclusively*: day 1 is the start date and
// day N is start + (N - 1) days. So a 75-day challenge beginning Tue, Jun 16
// ENDS on day 75 = Jun 16 + 74 days = Sat, Aug 29 (NOT Aug 30). Every surface
// that shows a date range — the "Set challenge length" ruler (screen 14) and
// every DayOneCard (screens 9, 22, 23) — derives from these helpers so they can
// never disagree.
//
// All arithmetic is done at LOCAL midnight. We deliberately avoid Date.toISOString()
// for storage because it converts to UTC and can shift the calendar day across
// timezones; instead startDate is persisted as a local "YYYY-MM-DD" string (see
// toDateString / fromDateString) and rehydrated to local midnight.

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Strip the time component, returning local midnight of the given date. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Return a new date n days after d (n may be negative), at local midnight. */
export function addDays(d: Date, n: number): Date {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Whole-day difference b - a (both treated at local midnight). */
export function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY);
}

/** The last day of the challenge under the inclusive convention. */
export function endDateInclusive(start: Date, durationDays: number): Date {
  return addDays(start, Math.max(0, durationDays - 1));
}

function monthDay(d: Date): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function weekdayMonthDay(d: Date): string {
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Card style: lowercased, no weekday, e.g. "jun 16 → aug 29".
 * Used on every DayOneCard.
 */
export function formatCard(start: Date, durationDays: number): string {
  const end = endDateInclusive(start, durationDays);
  return `${monthDay(start)} → ${monthDay(end)}`.toLowerCase();
}

/**
 * Long range with weekdays, e.g. "Tue, Jun 16 → Sat, Aug 29".
 * Used as the derived line under the challenge-length ruler (screen 14).
 */
export function formatLong(start: Date, durationDays: number): string {
  const end = endDateInclusive(start, durationDays);
  return `${weekdayMonthDay(start)} → ${weekdayMonthDay(end)}`;
}

/**
 * Single start date, with friendly relative labels.
 * "Today" / "Tomorrow" / otherwise "Tue, Jun 16". Used on the start-date ruler
 * (screen 15) value/derived line.
 */
export function formatStart(start: Date, ref: Date = new Date()): string {
  const diff = dayDiff(ref, start);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return weekdayMonthDay(start);
}

/** "YYYY-MM-DD" local key for a date — used to index per-day completion. */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Serialize a date for persistence (local calendar day, no timezone shift). */
export function toDateString(d: Date): string {
  return dateKey(startOfDay(d));
}

/** Rehydrate a "YYYY-MM-DD" string back to a local-midnight Date. */
export function fromDateString(s: string): Date {
  const [y, m, day] = s.split('-').map((n) => parseInt(n, 10));
  return new Date(y, m - 1, day);
}

/**
 * 1-based inclusive day number of the challenge as of `ref` (default: now).
 * Start day is Day 1. Clamped to >= 1 so a not-yet-started challenge still
 * reads as Day 1 rather than Day 0 or a negative number.
 */
export function dayNumber(start: Date, ref: Date = new Date()): number {
  return Math.max(1, dayDiff(start, ref) + 1);
}

/** Short weekday label for a date, e.g. "Tue". */
export function weekdayShort(d: Date): string {
  return WEEKDAYS_SHORT[d.getDay()];
}

/** Short month label for a month index 0-11, e.g. "Aug". */
export function monthShort(monthIndex: number): string {
  return MONTHS_SHORT[((monthIndex % 12) + 12) % 12];
}

export { MONTHS_SHORT, WEEKDAYS_SHORT };
