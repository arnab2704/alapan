import { describe, expect, it } from "vitest";
import { participationStreak } from "../src";

describe("participationStreak", () => {
  it("counts consecutive days ending today", () => {
    expect(participationStreak(["2026-09-22", "2026-09-23", "2026-09-24"], "2026-09-24")).toBe(3);
  });
  it("does not treat a fresh morning as a broken run", () => {
    expect(participationStreak(["2026-09-22", "2026-09-23"], "2026-09-24")).toBe(2);
  });
  it("resets after a gap, and is zero with no history", () => {
    expect(participationStreak(["2026-09-20", "2026-09-21"], "2026-09-24")).toBe(0);
    expect(participationStreak([], "2026-09-24")).toBe(0);
  });
  it("handles month boundaries and unordered input", () => {
    expect(participationStreak(["2026-10-01", "2026-09-30", "2026-09-29"], "2026-10-01")).toBe(3);
  });
});
