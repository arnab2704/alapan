import { describe, expect, it } from "vitest";
import {
  getAllLevelQuizQuestions,
  getQuizLevelQuestionCount,
  getQuizSet,
  getTotalLevelQuizQuestions
} from "../src/quizLevels";
import {
  QUIZ_LEVEL_COUNT,
  QUIZ_SETS_PER_LEVEL,
  countPassedSets,
  getNextQuizSet,
  isQuizLevelUnlocked,
  isQuizSetUnlocked,
  isValidQuizSet,
  passScoreFor,
  recordQuizSetResult
} from "../src/quizProgress";
import type { QuizProgressMap } from "../src/quizProgress";

describe("level quiz bank integrity", () => {
  const all = getAllLevelQuizQuestions();

  it("holds at least 850 questions across 10 levels of at least 70 each", () => {
    expect(getTotalLevelQuizQuestions()).toBeGreaterThanOrEqual(850);
    for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) {
      expect(getQuizLevelQuestionCount(level)).toBeGreaterThanOrEqual(70);
    }
  });

  it("gives every question non-empty text in both languages and exactly 4 distinct options", () => {
    for (const q of all) {
      expect(q.questionBn.trim().length, q.id).toBeGreaterThan(0);
      expect(q.questionEn.trim().length, q.id).toBeGreaterThan(0);
      expect(q.options, q.id).toHaveLength(4);
      const bn = q.options.map((o) => o.textBn.trim());
      const en = q.options.map((o) => o.textEn.trim());
      expect(
        bn.every((t) => t.length > 0),
        q.id
      ).toBe(true);
      expect(
        en.every((t) => t.length > 0),
        q.id
      ).toBe(true);
      expect(new Set(bn).size, `${q.id} has duplicate Bengali options`).toBe(4);
      expect(new Set(en).size, `${q.id} has duplicate English options`).toBe(4);
      expect(q.correctIndex).toBe(0);
    }
  });

  it("has unique ids and no duplicate question text", () => {
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    const dupes = new Map<string, string[]>();
    for (const q of all) {
      const key = q.questionEn.trim().toLowerCase();
      dupes.set(key, [...(dupes.get(key) ?? []), q.id]);
    }
    const repeated = [...dupes.entries()].filter(([, ids]) => ids.length > 1);
    expect(repeated).toEqual([]);
  });

  it("has no leftover authoring artifacts in any text", () => {
    for (const q of all) {
      const texts = [q.questionBn, q.questionEn, ...q.options.flatMap((o) => [o.textBn, o.textEn])];
      for (const text of texts) {
        expect(text, q.id).not.toMatch(/\.\.\.|…|নয়,|\?\?|undefined/);
      }
    }
  });

  it("covers every category", () => {
    const categories = new Set(all.map((q) => q.category));
    for (const c of [
      "history",
      "geography",
      "culture",
      "literature",
      "religion",
      "festival",
      "language",
      "arts",
      "people"
    ]) {
      expect(categories.has(c as never), c).toBe(true);
    }
  });

  it("mixes several categories inside every level", () => {
    for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) {
      const inLevel = all.filter((q) => q.id.startsWith(`L${String(level).padStart(2, "0")}-`));
      expect(new Set(inLevel.map((q) => q.category)).size, `level ${level}`).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("getQuizSet", () => {
  it("partitions each level into 10 sets of 7-12 that together use every question exactly once", () => {
    for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) {
      const ids: string[] = [];
      for (let set = 1; set <= QUIZ_SETS_PER_LEVEL; set++) {
        const { questions } = getQuizSet(level, set);
        expect(questions.length).toBeGreaterThanOrEqual(7);
        expect(questions.length).toBeLessThanOrEqual(12);
        ids.push(...questions.map((q) => q.id));
      }
      expect(ids).toHaveLength(getQuizLevelQuestionCount(level));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("is deterministic", () => {
    expect(getQuizSet(3, 4)).toEqual(getQuizSet(3, 4));
  });

  it("shuffles options so the correct answer is not always in one position", () => {
    const positions = new Set<number>();
    for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) {
      for (let set = 1; set <= QUIZ_SETS_PER_LEVEL; set++) {
        for (const q of getQuizSet(level, set).questions) positions.add(q.correctIndex);
      }
    }
    expect(positions).toEqual(new Set([0, 1, 2, 3]));
  });

  it("keeps correctIndex pointing at the right text after shuffling", () => {
    const source = new Map(getAllLevelQuizQuestions().map((q) => [q.id, q]));
    for (const q of getQuizSet(5, 2).questions) {
      const original = source.get(q.id)!;
      expect(q.options[q.correctIndex].textEn).toBe(original.options[0].textEn);
    }
  });

  it("localises bare numeric options to Bengali digits", () => {
    const withYear = getAllLevelQuizQuestions().find((q) => q.options.some((o) => o.textEn === "1757"))!;
    const option = withYear.options.find((o) => o.textEn === "1757")!;
    expect(option.textBn).toBe("১৭৫৭");
  });

  it("rejects out-of-range levels and sets", () => {
    expect(() => getQuizSet(0, 1)).toThrow(RangeError);
    expect(() => getQuizSet(11, 1)).toThrow(RangeError);
    expect(() => getQuizSet(1, 11)).toThrow(RangeError);
  });
});

describe("quiz progression", () => {
  it("validates set coordinates", () => {
    expect(isValidQuizSet(1, 1)).toBe(true);
    expect(isValidQuizSet(10, 10)).toBe(true);
    expect(isValidQuizSet(0, 1)).toBe(false);
    expect(isValidQuizSet(1, 1.5)).toBe(false);
  });

  it("passes a set at 70% of its questions, rounded up", () => {
    expect(passScoreFor(10)).toBe(7);
    expect(passScoreFor(11)).toBe(8);
    expect(passScoreFor(12)).toBe(9);
  });

  it("unlocks only the very first set on a fresh profile", () => {
    const fresh: QuizProgressMap = {};
    expect(isQuizSetUnlocked(fresh, 1, 1)).toBe(true);
    expect(isQuizSetUnlocked(fresh, 1, 2)).toBe(false);
    expect(isQuizLevelUnlocked(fresh, 2)).toBe(false);
    expect(getNextQuizSet(fresh)).toEqual({ level: 1, set: 1 });
  });

  it("unlocks the next set only after passing, and never revokes a pass", () => {
    let progress = recordQuizSetResult({}, 1, 1, 6, 10);
    expect(isQuizSetUnlocked(progress, 1, 2)).toBe(false);
    progress = recordQuizSetResult(progress, 1, 1, 8, 10);
    expect(isQuizSetUnlocked(progress, 1, 2)).toBe(true);
    progress = recordQuizSetResult(progress, 1, 1, 2, 10);
    expect(progress["1-1"]).toEqual({ bestScore: 8, total: 10, passed: true });
    expect(isQuizSetUnlocked(progress, 1, 2)).toBe(true);
  });

  it("unlocks the next level after the last set of the previous level is passed", () => {
    let progress: QuizProgressMap = {};
    for (let set = 1; set <= QUIZ_SETS_PER_LEVEL; set++)
      progress = recordQuizSetResult(progress, 1, set, 10, 10);
    expect(isQuizLevelUnlocked(progress, 2)).toBe(true);
    expect(countPassedSets(progress, 1)).toBe(10);
    expect(getNextQuizSet(progress)).toEqual({ level: 2, set: 1 });
  });

  it("reports completion when every set is passed", () => {
    let progress: QuizProgressMap = {};
    for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) {
      for (let set = 1; set <= QUIZ_SETS_PER_LEVEL; set++)
        progress = recordQuizSetResult(progress, level, set, 10, 10);
    }
    expect(getNextQuizSet(progress)).toBeNull();
  });
});
