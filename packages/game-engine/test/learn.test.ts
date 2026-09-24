import { describe, expect, it } from "vitest";
import {
  generateExercises,
  getAllLearnLessons,
  getDistractorPool,
  getLearnLesson,
  getLearnUnits,
  mulberry32,
  EMPTY_LEARN_PROGRESS,
  recordLessonResult,
  nextStreak,
  starsForAccuracy,
  getNextLessonId
} from "../src";
import { tokenizeToTiles } from "@alapon/bengali";

const lessons = getAllLearnLessons();

describe("curriculum integrity", () => {
  it("has unique lesson and item ids", () => {
    const lessonIds = lessons.map((l) => l.lesson.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    for (const unit of getLearnUnits()) {
      const ids = unit.lessons.filter((l) => !l.review).flatMap((l) => l.items.map((i) => i.id));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("gives every lesson at least three items, each with Bengali text and a pronunciation or meaning", () => {
    for (const { lesson } of lessons) {
      expect(lesson.items.length).toBeGreaterThanOrEqual(3);
      for (const item of lesson.items) {
        expect(item.bn).toMatch(/[ঀ-৿]/);
        expect(item.roman.length).toBeGreaterThan(0);
        if (lesson.kind === "word") expect(item.en).toBeTruthy();
        if (lesson.kind === "number") expect(item.word).toBeTruthy();
      }
    }
  });

  it("keeps answer labels unique inside each unit so a quiz answer is never ambiguous", () => {
    for (const unit of getLearnUnits()) {
      for (const kind of ["letter", "sign", "number", "conjunct"] as const) {
        const pool = getDistractorPool(unit, kind);
        const romans = pool.map((i) => i.roman);
        expect(new Set(romans).size, `${unit.id}/${kind}`).toBe(romans.length);
        const glyphs = pool.map((i) => i.bn);
        expect(new Set(glyphs).size, `${unit.id}/${kind} glyphs`).toBe(glyphs.length);
      }
    }
  });

  it("makes every example word start with (or contain) its letter", () => {
    for (const { lesson } of lessons) {
      for (const item of lesson.items) {
        if (!item.example) continue;
        const word = item.example.bn;
        if (lesson.kind === "conjunct") expect(word, item.bn).toContain(item.bn);
        else if (lesson.id.startsWith("vowels") || lesson.id.startsWith("consonants-")) {
          const special = ["ড়", "ঢ়", "য়", "ৎ", "ং", "ঃ", "ঁ", "ঞ"];
          if (
            !special.includes(item.bn) &&
            item.bn !== "ষ" &&
            item.bn !== "ঙ" &&
            item.bn !== "ণ" &&
            item.bn !== "ঈ" &&
            item.bn !== "ঔ" &&
            item.bn !== "ঐ"
          ) {
            expect(word.startsWith(item.bn), `${item.bn} -> ${word}`).toBe(true);
          }
        }
      }
    }
  });

  it("has at least the seven core units and 30+ lessons", () => {
    expect(getLearnUnits().length).toBeGreaterThanOrEqual(6);
    expect(lessons.length).toBeGreaterThanOrEqual(25);
  });
});

describe("generateExercises", () => {
  for (const { unit, lesson } of lessons) {
    it(`builds valid exercises for ${lesson.id}`, () => {
      const pool = getDistractorPool(unit, lesson.kind);
      const exercises = generateExercises(lesson, pool, mulberry32(42));
      expect(exercises.length).toBeGreaterThan(3);

      const ids = new Set(lesson.items.map((i) => i.id));
      for (const ex of exercises) {
        if (ex.type === "flash") expect(ids.has(ex.itemId)).toBe(true);
        if (ex.type === "choose" || ex.type === "example") {
          expect(ex.options.length).toBeGreaterThanOrEqual(2);
          expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
          expect(ex.correctIndex).toBeLessThan(ex.options.length);
          const labels = ex.options.map((o) => o.text);
          expect(new Set(labels).size).toBe(labels.length);
        }
        if (ex.type === "match") {
          expect(ex.pairs.length).toBeGreaterThanOrEqual(2);
          const rights = ex.pairs.map((p) => p.right.text);
          expect(new Set(rights).size).toBe(rights.length);
          expect([...ex.rightOrder].sort()).toEqual(ex.pairs.map((p) => p.id).sort());
        }
        if (ex.type === "build") {
          expect(ex.tiles.map((x) => x.text).sort()).toEqual([...ex.answer].sort());
          expect(ex.answer.join("")).toBe(ex.target);
          expect(ex.tiles.map((x) => x.text).join("|")).not.toBe(ex.answer.join("|"));
        }
      }
    });
  }

  it("is deterministic for the same seed", () => {
    const found = getLearnLesson("words-2")!;
    const pool = getDistractorPool(found.unit, "word");
    const a = generateExercises(found.lesson, pool, mulberry32(7));
    const b = generateExercises(found.lesson, pool, mulberry32(7));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("puts the correct answer in the options and it is the right one", () => {
    const found = getLearnLesson("vowels-1")!;
    const exercises = generateExercises(found.lesson, getDistractorPool(found.unit, "letter"), mulberry32(3));
    const roman = exercises.find((e) => e.type === "choose" && e.question === "whichRoman");
    expect(roman).toBeDefined();
    if (roman?.type === "choose") {
      const item = found.lesson.items.find((i) => i.bn === roman.prompt.text)!;
      expect(roman.options[roman.correctIndex].text).toBe(item.roman);
    }
  });

  it("skips introduction cards for review lessons and caps their length", () => {
    const found = getLearnLesson("consonants-8")!;
    const exercises = generateExercises(found.lesson, getDistractorPool(found.unit, "letter"), mulberry32(1));
    expect(exercises.some((e) => e.type === "flash")).toBe(false);
    expect(exercises.length).toBeLessThanOrEqual(15);
  });

  it("tokenizes vocabulary words into more than one tile for building", () => {
    const found = getLearnLesson("words-6")!;
    const multi = found.lesson.items.filter((i) => tokenizeToTiles(i.bn).length >= 2);
    expect(multi.length).toBeGreaterThan(3);
  });
});

describe("learn progress", () => {
  it("awards 1-3 stars by accuracy", () => {
    expect(starsForAccuracy(1)).toBe(3);
    expect(starsForAccuracy(0.75)).toBe(2);
    expect(starsForAccuracy(0.4)).toBe(1);
  });

  it("records XP and never lowers stars", () => {
    const first = recordLessonResult(EMPTY_LEARN_PROGRESS, "vowels-1", 10, 10, "2026-09-24");
    expect(first.lessons["vowels-1"].stars).toBe(3);
    expect(first.xp).toBe(10 * 10 + 20);
    const second = recordLessonResult(first, "vowels-1", 3, 10, "2026-09-24");
    expect(second.lessons["vowels-1"].stars).toBe(3);
    expect(second.lessons["vowels-1"].completions).toBe(2);
  });

  it("tracks the daily streak: same day holds, next day extends, a gap resets", () => {
    let p = recordLessonResult(EMPTY_LEARN_PROGRESS, "a", 1, 1, "2026-09-24");
    expect(p.streak).toBe(1);
    p = recordLessonResult(p, "b", 1, 1, "2026-09-24");
    expect(p.streak).toBe(1);
    p = recordLessonResult(p, "c", 1, 1, "2026-09-25");
    expect(p.streak).toBe(2);
    expect(nextStreak(p, "2026-09-28")).toBe(1);
  });

  it("finds the next unfinished lesson in order", () => {
    const p = recordLessonResult(EMPTY_LEARN_PROGRESS, "l1", 1, 1, "2026-09-24");
    expect(getNextLessonId(p, ["l1", "l2", "l3"])).toBe("l2");
    expect(getNextLessonId(p, ["l1"])).toBeNull();
  });
});
