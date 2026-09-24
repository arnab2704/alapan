import { describe, expect, it } from "vitest";
import {
  daysUntil,
  getAllFestivals,
  getFestivalBySlug,
  getFestivalStatus,
  getNextFestival,
  getUpcomingFestivals
} from "../src/festivals";

describe("getAllFestivals", () => {
  it("returns every festival in chronological order", () => {
    const all = getAllFestivals();
    expect(all.length).toBeGreaterThan(10);
    for (let i = 1; i < all.length; i++) {
      expect(new Date(all[i].date).getTime()).toBeGreaterThanOrEqual(new Date(all[i - 1].date).getTime());
    }
  });
});

describe("getFestivalBySlug", () => {
  it("finds Durga Puja by slug with its six-day breakdown from Mahalaya to Dashami", () => {
    const durgaPuja = getFestivalBySlug("durga-puja-2026");
    expect(durgaPuja).toBeDefined();
    expect(durgaPuja?.days).toHaveLength(6);
    expect(durgaPuja?.days?.[0]).toMatchObject({ labelEn: "Mahalaya", date: "2026-10-10" });
    expect(durgaPuja?.days?.[5]).toMatchObject({ labelEn: "Bijoya Dashami", date: "2026-10-21" });
  });

  it("returns undefined for an unknown slug", () => {
    expect(getFestivalBySlug("not-a-real-festival")).toBeUndefined();
  });
});

describe("getUpcomingFestivals / getNextFestival", () => {
  it("excludes festivals that have already fully passed", () => {
    const from = new Date(2026, 9, 22); // 22 Oct 2026, the day after Durga Puja ends
    const upcoming = getUpcomingFestivals(from);
    expect(upcoming.some((f) => f.slug === "durga-puja-2026")).toBe(false);
    expect(upcoming.some((f) => f.slug === "kojagari-lakshmi-puja-2026")).toBe(true);
  });

  it("still includes a multi-day festival that's in progress", () => {
    const from = new Date(2026, 9, 19); // 19 Oct 2026 - Durga Ashtami, mid-festival
    const upcoming = getUpcomingFestivals(from);
    expect(upcoming.some((f) => f.slug === "durga-puja-2026")).toBe(true);
  });

  it("getNextFestival still returns Durga Puja while it's ongoing, the day after Mahalaya", () => {
    const from = new Date(2026, 9, 11); // 11 Oct 2026, day after Mahalaya (which is Durga Puja's opening day)
    expect(getNextFestival(from)?.slug).toBe("durga-puja-2026");
  });

  it("respects the limit parameter", () => {
    const from = new Date(2026, 9, 1);
    expect(getUpcomingFestivals(from, 2)).toHaveLength(2);
  });
});

describe("getFestivalStatus", () => {
  const durgaPuja = getFestivalBySlug("durga-puja-2026")!;

  it("is upcoming before Mahalaya", () => {
    expect(getFestivalStatus(new Date(2026, 9, 5), durgaPuja)).toBe("upcoming");
  });

  it("is ongoing on Ashtami, mid-festival", () => {
    expect(getFestivalStatus(new Date(2026, 9, 19), durgaPuja)).toBe("ongoing");
  });

  it("is ongoing on both the first day (Mahalaya) and the last day (Dashami)", () => {
    expect(getFestivalStatus(new Date(2026, 9, 10), durgaPuja)).toBe("ongoing");
    expect(getFestivalStatus(new Date(2026, 9, 21), durgaPuja)).toBe("ongoing");
  });

  it("is past the day after Dashami", () => {
    expect(getFestivalStatus(new Date(2026, 9, 22), durgaPuja)).toBe("past");
  });
});

describe("daysUntil", () => {
  it("counts down correctly to Durga Puja's first day (Mahalaya)", () => {
    const durgaPuja = getFestivalBySlug("durga-puja-2026")!;
    // "today" is this session's system date - 23 September 2026, 17 days before Mahalaya (10 October).
    expect(daysUntil(new Date(2026, 8, 23), durgaPuja)).toBe(17);
  });

  it("is 0 on the festival's own start date", () => {
    const durgaPuja = getFestivalBySlug("durga-puja-2026")!;
    expect(daysUntil(new Date(2026, 9, 10), durgaPuja)).toBe(0);
  });
});
