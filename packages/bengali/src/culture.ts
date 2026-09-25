import { ADDA_PROMPTS } from "./data/adda-prompts";
import type { AddaPrompt } from "./data/adda-prompts";
import { FESTIVE_ADDA_PROMPTS, FESTIVE_DAILY_WORDS } from "./data/festive-daily";
import { FESTIVE_ADDA_PROMPTS_2, FESTIVE_DAILY_WORDS_2 } from "./data/festive-daily-2";
import { CULTURE_PEOPLE, DAILY_WORDS, HISTORY_EVENTS } from "./data/culture";
import type { CulturePerson, DailyWord, HistoryEvent } from "./data/culture";

export type { AddaPrompt, CulturePerson, DailyWord, HistoryEvent };

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

function isoOf(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Same word all day for everyone; changes at local midnight. Festival dates use a targeted word. */
export function getDailyWord(date: Date): DailyWord {
  return (
    FESTIVE_DAILY_WORDS[isoOf(date)] ?? FESTIVE_DAILY_WORDS_2[isoOf(date)] ?? rotate(DAILY_WORDS, date, 0)
  );
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

export function getAllDailyWords(): DailyWord[] {
  return [...DAILY_WORDS];
}

export function getAllCulturePeople(): CulturePerson[] {
  return [...CULTURE_PEOPLE];
}

/** Today's Adda conversation starter: the same for everyone on a given day. */
export function getAllAddaPromptsCount(): number {
  return ADDA_PROMPTS.length;
}

export function getAddaPrompt(date: Date): AddaPrompt {
  return (
    FESTIVE_ADDA_PROMPTS[isoOf(date)] ?? FESTIVE_ADDA_PROMPTS_2[isoOf(date)] ?? rotate(ADDA_PROMPTS, date, 3)
  );
}
