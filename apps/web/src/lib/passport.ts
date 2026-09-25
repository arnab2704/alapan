import { track } from "@/lib/analytics";

export type PassportCategory = "words" | "places" | "people" | "stories" | "festivals" | "games" | "lessons";
export const PASSPORT_CATEGORIES: PassportCategory[] = [
  "words",
  "places",
  "people",
  "stories",
  "festivals",
  "games",
  "lessons"
];

const KEY = "alapon.passport.v1";
export const PASSPORT_EVENT = "alapon:passport";

export type PassportData = Record<PassportCategory, string[]>;

export function emptyPassport(): PassportData {
  return { words: [], places: [], people: [], stories: [], festivals: [], games: [], lessons: [] };
}

export function readPassport(): PassportData {
  const data = emptyPassport();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return data;
    const parsed = JSON.parse(raw) as Partial<Record<PassportCategory, unknown>>;
    for (const category of PASSPORT_CATEGORIES) {
      const list = parsed[category];
      if (Array.isArray(list)) data[category] = list.filter((v): v is string => typeof v === "string");
    }
  } catch {
    // unreadable storage: start empty
  }
  return data;
}

/**
 * Records that the person discovered something (a word, a person, a festival...). Each id counts once.
 * Returns true when it was new. The passport is local to this device until accounts sync it.
 */
export function recordDiscovery(category: PassportCategory, id: string): boolean {
  const data = readPassport();
  if (data[category].includes(id)) return false;
  data[category] = [...data[category], id].slice(-2000);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable: nothing to persist
  }
  window.dispatchEvent(new Event(PASSPORT_EVENT));
  track("passport_progress", { category, total: data[category].length });
  return true;
}

/** Counts at which a category earns a stamp. Gentle, evenly spaced, and always finite. */
export const PASSPORT_MILESTONES = [1, 10, 25, 50, 100];

/** The next milestone above `count`, or null once every stamp is earned. */
export function nextMilestone(count: number): number | null {
  return PASSPORT_MILESTONES.find((m) => m > count) ?? null;
}

export function earnedMilestones(count: number): number[] {
  return PASSPORT_MILESTONES.filter((m) => count >= m);
}
