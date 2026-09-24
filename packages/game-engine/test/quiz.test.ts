import { describe, expect, it } from "vitest";
import {
  DAILY_QUIZ_SIZE,
  checkQuizAnswer,
  getAllQuizQuestions,
  getDailyQuiz,
  getQuizQuestionById,
  scoreQuiz
} from "../src/quiz";

describe("getAllQuizQuestions", () => {
  it("returns every question, each with exactly 4 options and a valid correctIndex", () => {
    const all = getAllQuizQuestions();
    expect(all.length).toBeGreaterThanOrEqual(DAILY_QUIZ_SIZE);
    for (const question of all) {
      expect(question.options).toHaveLength(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.questionBn.length).toBeGreaterThan(0);
      expect(question.questionEn.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate ids", () => {
    const ids = getAllQuizQuestions().map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getQuizQuestionById", () => {
  it("finds a known question", () => {
    expect(getQuizQuestionById("history-tagore-nobel")?.category).toBe("history");
  });

  it("returns undefined for an unknown id", () => {
    expect(getQuizQuestionById("not-a-real-question")).toBeUndefined();
  });
});

describe("getDailyQuiz", () => {
  it("returns DAILY_QUIZ_SIZE distinct questions by default", () => {
    const quiz = getDailyQuiz(new Date(2026, 8, 23));
    expect(quiz).toHaveLength(DAILY_QUIZ_SIZE);
    expect(new Set(quiz.map((q) => q.id)).size).toBe(DAILY_QUIZ_SIZE);
  });

  it("is deterministic - the same date always yields the same quiz, in the same order", () => {
    const a = getDailyQuiz(new Date(2026, 8, 23));
    const b = getDailyQuiz(new Date(2026, 8, 23));
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it("differs (with overwhelming likelihood) between two different dates", () => {
    const today = getDailyQuiz(new Date(2026, 8, 23));
    const tomorrow = getDailyQuiz(new Date(2026, 8, 24));
    expect(today.map((q) => q.id)).not.toEqual(tomorrow.map((q) => q.id));
  });

  it("caps at the size of the question bank when asked for more than exists", () => {
    const all = getAllQuizQuestions();
    const quiz = getDailyQuiz(new Date(2026, 8, 23), all.length + 50);
    expect(quiz).toHaveLength(all.length);
  });

  it("reorders each question's options rather than serving the source authoring order verbatim", () => {
    const quiz = getDailyQuiz(new Date(2026, 8, 23), 21);
    for (const question of quiz) {
      const source = getQuizQuestionById(question.id)!;
      // Same four options present (by English text), just possibly reordered.
      expect(new Set(question.options.map((o) => o.textEn))).toEqual(
        new Set(source.options.map((o) => o.textEn))
      );
      // correctIndex still points at the actual correct option's text after reordering.
      expect(question.options[question.correctIndex].textEn).toBe(source.options[source.correctIndex].textEn);
    }
  });

  it("does not cluster every correct answer at the same option position (the bug this replaced)", () => {
    // Sample many days so the correct-answer position is checked across a wide, deterministic spread.
    const positions = new Set<number>();
    for (let day = 0; day < 30; day++) {
      for (const question of getDailyQuiz(new Date(2026, 0, 1 + day), 21)) {
        positions.add(question.correctIndex);
      }
    }
    expect(positions.size).toBeGreaterThan(1);
  });
});

describe("checkQuizAnswer / scoreQuiz", () => {
  const quiz = getDailyQuiz(new Date(2026, 8, 23), 3);

  it("checkQuizAnswer matches the correct index only", () => {
    const question = quiz[0];
    expect(checkQuizAnswer(question, question.correctIndex)).toBe(true);
    expect(checkQuizAnswer(question, (question.correctIndex + 1) % 4)).toBe(false);
  });

  it("scoreQuiz counts only correct, answered questions", () => {
    const answers = [quiz[0].correctIndex, (quiz[1].correctIndex + 1) % 4, null];
    expect(scoreQuiz(quiz, answers)).toBe(1);
  });

  it("scores 0 when nothing is answered", () => {
    expect(scoreQuiz(quiz, [null, null, null])).toBe(0);
  });

  it("scores full marks when every answer is correct", () => {
    const answers = quiz.map((q) => q.correctIndex);
    expect(scoreQuiz(quiz, answers)).toBe(quiz.length);
  });
});
