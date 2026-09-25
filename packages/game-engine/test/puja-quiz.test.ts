import { describe, expect, it } from "vitest";
import { PUJA_QUIZ } from "../src/data/puja-quiz";
import { getDailyQuiz } from "../src/quiz";

const DAYS = ["2026-10-10", "2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21"];

describe("Sharodiya quiz sets", () => {
  it("has ten well-formed questions for each of Mahalaya and Shashthi to Dashami", () => {
    for (const day of DAYS) expect(PUJA_QUIZ[day], day).toBeDefined();
    expect(Object.keys(PUJA_QUIZ).length).toBe(16);
    const ids = new Set<string>();
    for (const day of DAYS) {
      const questions = PUJA_QUIZ[day];
      expect(questions).toHaveLength(10);
      for (const q of questions) {
        expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false);
        ids.add(q.id);
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(new Set(q.options.map((o) => o.textBn)).size, `${q.id} duplicate options`).toBe(4);
        expect(q.explanationBn && q.explanationEn, `${q.id} needs explanations`).toBeTruthy();
      }
    }
  });

  it("also covers the countdown days and the Lakshmi, Kali, Bhai Phota and Jagaddhatri festivals", () => {
    const extra = ["2026-10-11", "2026-10-16", "2026-10-25", "2026-11-08", "2026-11-10", "2026-11-17"];
    const seen = new Set<string>();
    for (const day of extra) {
      const questions = PUJA_QUIZ[day];
      expect(questions.length, day).toBeGreaterThanOrEqual(9);
      for (const q of questions) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.textBn)).size, `${q.id} duplicate options`).toBe(4);
        expect(q.explanationBn && q.explanationEn).toBeTruthy();
        seen.add(q.id);
      }
      expect(
        getDailyQuiz(new Date(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8))))
          .length
      ).toBe(5);
    }
    expect(seen.size).toBeGreaterThanOrEqual(45);
  });

  it("serves five questions from the day's set on festival dates, and the normal pool otherwise", () => {
    const quiz = getDailyQuiz(new Date(2026, 9, 19));
    expect(quiz).toHaveLength(5);
    const allowed = new Set(PUJA_QUIZ["2026-10-19"].map((q) => q.id));
    expect(quiz.every((q) => allowed.has(q.id))).toBe(true);
    const ordinary = getDailyQuiz(new Date(2026, 9, 12));
    expect(ordinary.every((q) => q.id.startsWith("puja-"))).toBe(false);
  });
});
