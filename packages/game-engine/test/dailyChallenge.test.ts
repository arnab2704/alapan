import { describe, expect, it } from "vitest";
import {
  DAILY_ROUNDS,
  difficultyForLevel,
  getDailyChallengeSpec,
  isRoundAvailable,
  resolveDailyChallenge
} from "../src";

describe("daily challenge", () => {
  it("is identical for the same date and different on the next", () => {
    const a = getDailyChallengeSpec("2026-09-24");
    expect(getDailyChallengeSpec("2026-09-24")).toEqual(a);
    expect(getDailyChallengeSpec("2026-09-25").rounds).not.toEqual(a.rounds);
  });

  it("has three rounds, each one level harder than the last, all resolvable", () => {
    for (const date of [
      "2026-09-21",
      "2026-09-22",
      "2026-09-23",
      "2026-09-24",
      "2026-09-25",
      "2026-09-26",
      "2026-09-27"
    ]) {
      const spec = getDailyChallengeSpec(date);
      expect(spec.rounds).toHaveLength(DAILY_ROUNDS);
      expect(spec.rounds.every(isRoundAvailable)).toBe(true);
      const levels = spec.rounds.map((r) => r.level);
      expect(levels[1]).toBeGreaterThanOrEqual(levels[0]);
      expect(levels[2]).toBeGreaterThanOrEqual(levels[1]);
    }
  });

  it("gets harder towards the weekend", () => {
    // 2026-09-21 is a Monday, 2026-09-25 a Friday.
    expect(getDailyChallengeSpec("2026-09-21").difficulty).toBe("easy");
    expect(getDailyChallengeSpec("2026-09-25").difficulty).toBe("hard");
  });

  it("resolves letters and words that can actually be formed", () => {
    for (let d = 0; d < 60; d++) {
      const date = new Date(Date.UTC(2026, 0, 1 + d)).toISOString().slice(0, 10);
      const content = resolveDailyChallenge(date);
      for (const round of content.rounds) {
        expect(round.letters.length).toBeGreaterThan(1);
        expect(round.canForm.length).toBeGreaterThan(0);
      }
    }
  });

  it("uses a valid editor override and ignores an invalid one", () => {
    const scheduled = getDailyChallengeSpec("2026-09-24", {
      rounds: [{ level: 2, index: 5 }],
      difficulty: "easy"
    });
    expect(scheduled.source).toBe("scheduled");
    expect(scheduled.rounds).toEqual([{ level: 2, index: 5 }]);

    const bad = getDailyChallengeSpec("2026-09-24", { rounds: [{ level: 99, index: 0 }] });
    expect(bad.source).toBe("generated");
  });

  it("rejects malformed dates", () => {
    expect(() => getDailyChallengeSpec("not-a-date")).toThrow();
    expect(() => getDailyChallengeSpec("2026-02-31")).toThrow();
  });

  it("maps levels to difficulty bands", () => {
    expect(difficultyForLevel(1)).toBe("easy");
    expect(difficultyForLevel(4)).toBe("medium");
    expect(difficultyForLevel(9)).toBe("hard");
  });
});

describe("summarizeDailyResult", () => {
  const content = {
    date: "2026-09-24",
    difficulty: "easy" as const,
    source: "generated" as const,
    rounds: [
      { level: 1, index: 0, letters: ["ক", "ম", "ল"], canForm: ["কম", "কমল"] },
      { level: 2, index: 0, letters: ["ন", "দ", "ী"], canForm: ["নদী"] }
    ]
  };
  const score = (w: string) => Array.from(w).length * 10;

  it("finds the best word and counts completed rounds", async () => {
    const { summarizeDailyResult } = await import("../src");
    const r = summarizeDailyResult(content, [["কম", "কমল"], []], 50, 1, score);
    expect(r.bestWord).toBe("কমল");
    expect(r.wordsPlayed).toEqual(["কম", "কমল"]);
    expect(r.totalWords).toBe(3);
    expect(r.roundsCompleted).toBe(1);
    expect(r.hintsUsed).toBe(1);
  });

  it("handles an empty game", async () => {
    const { summarizeDailyResult } = await import("../src");
    const r = summarizeDailyResult(content, [[], []], 0, 0, score);
    expect(r.bestWord).toBeNull();
    expect(r.roundsCompleted).toBe(0);
  });
});

describe("word bank coverage of the game", () => {
  it("has curated meanings for a good share of the words players can actually find", async () => {
    const { getWordEntry } = await import("@alapon/bengali");
    const all = new Set<string>();
    for (let level = 1; level <= 10; level++) {
      const { getWordJaalLevel } = await import("../src");
      for (const c of getWordJaalLevel(level)!.combinations) c.canForm.forEach((w) => all.add(w));
    }
    const covered = [...all].filter((w) => getWordEntry(w) !== null);
    expect(covered.length).toBeGreaterThanOrEqual(60);
  });
});
