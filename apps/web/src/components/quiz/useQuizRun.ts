"use client";

import { useMemo, useState } from "react";
import { scoreQuiz } from "@alapon/game-engine";
import type { QuizQuestion } from "@alapon/game-engine";

export interface UseQuizRunResult {
  currentIndex: number;
  currentQuestion: QuizQuestion | null;
  currentAnswer: number | null;
  isFinished: boolean;
  score: number;
  selectAnswer: (optionIndex: number) => void;
  goToNextQuestion: () => void;
  restart: () => void;
}

/** In-memory run through a fixed list of questions (level-quiz sets; the daily quiz persists separately). */
export function useQuizRun(questions: QuizQuestion[]): UseQuizRunResult {
  const [answers, setAnswers] = useState<Array<number | null>>(() => questions.map(() => null));
  const [currentIndex, setCurrentIndex] = useState(0);

  const score = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);

  return {
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    currentAnswer: answers[currentIndex] ?? null,
    isFinished: questions.length > 0 && currentIndex >= questions.length,
    score,
    selectAnswer(optionIndex) {
      if (currentIndex >= questions.length || answers[currentIndex] !== null) return;
      setAnswers((current) => current.map((a, i) => (i === currentIndex ? optionIndex : a)));
    },
    goToNextQuestion() {
      setCurrentIndex((i) => Math.min(i + 1, questions.length));
    },
    restart() {
      setAnswers(questions.map(() => null));
      setCurrentIndex(0);
    }
  };
}
