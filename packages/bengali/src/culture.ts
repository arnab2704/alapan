import { CULTURE_PEOPLE, DAILY_WORDS, HISTORY_EVENTS } from "./data/culture";
import type { CulturePerson, DailyWord, HistoryEvent } from "./data/culture";

export type { CulturePerson, DailyWord, HistoryEvent };

/** Whole days since 2026-01-01 (DST-safe), the shared seed for daily rotations. */
function dayIndex(date: Date): number {
  const from = Date.UTC(2026, 0, 1);
  const to = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((to - from) / 86_400_000);
}

function rotate<T>(items: T[], date: Date, offset: number): T {
  const i = (((dayIndex(date) + offset) % items.length) + items.length) % items.length;
  return items[i];
}

/** Same word all day for everyone; changes at local midnight. */
export function getDailyWord(date: Date): DailyWord {
  return rotate(DAILY_WORDS, date, 0);
}

/** Offset so word and person don't advance in lockstep through their lists. */
export function getPersonOfTheDay(date: Date): CulturePerson {
  return rotate(CULTURE_PEOPLE, date, 7);
}

export function getAllHistoryEvents(): HistoryEvent[] {
  return [...HISTORY_EVENTS];
}

export interface HistoryForDate {
  event: HistoryEvent;
  /** Days until the next anniversary of this event (0 = it is today). */
  daysAway: number;
  /** Years since the event as of its next anniversary. */
  yearsAgo: number;
}

/** The event whose anniversary is today, or else the nearest upcoming one. */
export function getHistoryForDate(date: Date): HistoryForDate {
  const todayUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  let best: HistoryForDate | undefined;
  for (const event of HISTORY_EVENTS) {
    let year = date.getFullYear();
    let next = Date.UTC(year, event.month - 1, event.day);
    if (next < todayUtc) {
      year += 1;
      next = Date.UTC(year, event.month - 1, event.day);
    }
    const daysAway = Math.round((next - todayUtc) / 86_400_000);
    if (!best || daysAway < best.daysAway) best = { event, daysAway, yearsAgo: year - event.year };
  }
  return best as HistoryForDate;
}
