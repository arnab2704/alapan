import { FESTIVALS } from "./data/festivals";
import type { Festival, FestivalCategory, FestivalDay } from "./data/festivals";

export type { Festival, FestivalCategory, FestivalDay };

export type FestivalStatus = "upcoming" | "ongoing" | "past";

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function atLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** DST-safe day count - see calendar.ts's daysBetween for why raw ms division is unsafe. */
function daysBetween(from: Date, to: Date): number {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / 86_400_000);
}

function festivalStart(festival: Festival): Date {
  return parseIsoDate(festival.date);
}

function festivalEnd(festival: Festival): Date {
  return parseIsoDate(festival.endDate ?? festival.date);
}

/** All known festivals, sorted chronologically by start date. */
export function getAllFestivals(): Festival[] {
  return [...FESTIVALS].sort((a, b) => festivalStart(a).getTime() - festivalStart(b).getTime());
}

export function getFestivalBySlug(slug: string): Festival | undefined {
  return FESTIVALS.find((festival) => festival.slug === slug);
}

/**
 * Festivals that haven't finished yet as of `from` (a multi-day festival
 * still counts while it's ongoing), sorted chronologically. Pass `limit`
 * to cap the result, e.g. for a homepage "coming up" strip.
 */
export function getUpcomingFestivals(from: Date, limit?: number): Festival[] {
  const fromMidnight = atLocalMidnight(from);
  const upcoming = getAllFestivals().filter(
    (festival) => daysBetween(fromMidnight, festivalEnd(festival)) >= 0
  );
  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

export function getNextFestival(from: Date): Festival | undefined {
  return getUpcomingFestivals(from, 1)[0];
}

export function getFestivalStatus(from: Date, festival: Festival): FestivalStatus {
  const fromMidnight = atLocalMidnight(from);
  const daysToStart = daysBetween(fromMidnight, festivalStart(festival));
  const daysToEnd = daysBetween(fromMidnight, festivalEnd(festival));
  if (daysToStart > 0) return "upcoming";
  if (daysToEnd < 0) return "past";
  return "ongoing";
}

/** Whole days between `from` and a festival's first day (0 if it starts today, negative once it's begun). */
export function daysUntil(from: Date, festival: Festival): number {
  return daysBetween(atLocalMidnight(from), festivalStart(festival));
}
