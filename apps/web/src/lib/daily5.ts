import { toLocalIsoDate } from "@/lib/formatDate";

export type Daily5Item = "word" | "game" | "question" | "discover" | "learn";
export const DAILY5_ITEMS: Daily5Item[] = ["word", "game", "question", "discover", "learn"];

const KEY = "alapon.daily5.v1";
const DAYS_KEY = "alapon.daily5.days.v1";
export const DAILY5_EVENT = "alapon:daily5";

export interface Daily5State {
  date: string;
  done: Daily5Item[];
}

export function todayIso(): string {
  return toLocalIsoDate(new Date());
}

export function readDaily5(iso: string = todayIso()): Daily5State {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { date: iso, done: [] };
    const parsed = JSON.parse(raw) as Partial<Daily5State>;
    if (parsed.date !== iso || !Array.isArray(parsed.done)) return { date: iso, done: [] };
    return {
      date: iso,
      done: parsed.done.filter((d): d is Daily5Item => DAILY5_ITEMS.includes(d as Daily5Item))
    };
  } catch {
    return { date: iso, done: [] };
  }
}

/** Days on which all five were completed (most recent last, capped), for the passport and participation count. */
export function readCompletedDays(): string[] {
  try {
    const raw = window.localStorage.getItem(DAYS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((d): d is string => typeof d === "string") : [];
  } catch {
    return [];
  }
}

/** Marks one item done for today. Returns the new state and whether this call completed all five. */
export function markDaily5Item(
  item: Daily5Item,
  iso: string = todayIso()
): { state: Daily5State; completedNow: boolean } {
  const before = readDaily5(iso);
  if (before.done.includes(item)) return { state: before, completedNow: false };
  const state: Daily5State = { date: iso, done: [...before.done, item] };
  const completedNow = state.done.length === DAILY5_ITEMS.length;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    if (completedNow) {
      const days = readCompletedDays();
      if (!days.includes(iso))
        window.localStorage.setItem(DAYS_KEY, JSON.stringify([...days, iso].slice(-400)));
    }
  } catch {
    // Storage unavailable: progress lasts for this visit only.
  }
  window.dispatchEvent(new Event(DAILY5_EVENT));
  return { state, completedNow };
}

export { participationStreak } from "@alapon/game-engine";
