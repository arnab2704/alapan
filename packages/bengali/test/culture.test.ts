import { describe, expect, it } from "vitest";
import { getDailyWord, getHistoryForDate, getPersonOfTheDay, getAllHistoryEvents } from "../src";

describe("daily culture rotation", () => {
  it("returns the same word and person for the same day", () => {
    const a = new Date(2026, 9, 10, 1);
    const b = new Date(2026, 9, 10, 23);
    expect(getDailyWord(a)).toEqual(getDailyWord(b));
    expect(getPersonOfTheDay(a)).toEqual(getPersonOfTheDay(b));
  });

  it("changes the word on consecutive days", () => {
    expect(getDailyWord(new Date(2026, 5, 1)).word).not.toBe(getDailyWord(new Date(2026, 5, 2)).word);
  });

  it("works for dates before the epoch (no negative index)", () => {
    expect(getDailyWord(new Date(2020, 0, 1)).word).toBeTruthy();
  });

  it("finds the event on its anniversary", () => {
    const r = getHistoryForDate(new Date(2027, 1, 21));
    expect(r.event.slug).toBe("language-movement");
    expect(r.daysAway).toBe(0);
    expect(r.yearsAgo).toBe(75);
  });

  it("otherwise finds the nearest upcoming anniversary, wrapping the year", () => {
    const r = getHistoryForDate(new Date(2026, 11, 20));
    expect(r.event.slug).toBe("vivekananda-born");
    expect(r.daysAway).toBe(23);
  });

  it("has well-formed events", () => {
    for (const e of getAllHistoryEvents()) {
      expect(e.month).toBeGreaterThanOrEqual(1);
      expect(e.month).toBeLessThanOrEqual(12);
      expect(new Date(2024, e.month - 1, e.day).getDate()).toBe(e.day);
    }
  });
});
