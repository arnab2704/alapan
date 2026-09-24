"use client";

import { useEffect, useMemo, useState } from "react";
import { checkQuizAnswer, getDailyQuiz, scoreQuiz } from "@alapon/game-engine";
import type { QuizQuestion } from "@alapon/game-engine";
import { toLocalIsoDate } from "@/lib/formatDate";
import { readQuizProgress, writeQuizProgress } from "@/lib/quizProgress";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveQuizResult } from "@/lib/supabase/quizResults";

export interface UseDailyQuizResult {
  /** True until "today" and any saved progress have loaded on the client. */
  isLoading: boolean;
  questions: QuizQuestion[];
  currentIndex: number;
  currentQuestion: QuizQuestion | null;
  /** This question's selected option, or null if not yet answered. */
  currentAnswer: number | null;
  isFinished: boolean;
  score: number;
  /** Per-question correctness, in order - drives the share grid. */
  results: boolean[];
  /** ISO date of today's quiz, or null until the client has loaded. */
  dateIso: string | null;
  selectAnswer: (optionIndex: number) => void;
  goToNextQuestion: () => void;
  restart: () => void;
}

/**
 * Drives the daily quiz: which questions today's visitor sees (via
 * `getDailyQuiz`, deterministic per calendar day - same quiz for everyone,
 * no server round-trip needed), their in-progress answers, and resuming
 * exactly where they left off (or the finished result) on a later visit
 * the same day. Computes "today" only after client mount for the same
 * reason `useToday` does - see that hook's comment.
 */
export function useDailyQuiz(): UseDailyQuizResult {
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const today = new Date();
    const iso = toLocalIsoDate(today);
    const dailyQuestions = getDailyQuiz(today);
    const saved = readQuizProgress(iso);

    setTodayIso(iso);
    setQuestions(dailyQuestions);
    if (saved && saved.answers.length === dailyQuestions.length) {
      setAnswers(saved.answers);
      setCurrentIndex(saved.currentIndex);
    } else {
      setAnswers(dailyQuestions.map(() => null));
      setCurrentIndex(0);
    }
  }, []);

  function persist(nextAnswers: Array<number | null>, nextIndex: number) {
    if (!todayIso) return;
    writeQuizProgress({ date: todayIso, answers: nextAnswers, currentIndex: nextIndex });
  }

  function selectAnswer(optionIndex: number) {
    if (currentIndex >= questions.length) return;
    if (answers[currentIndex] !== null) return; // already answered - immutable once picked
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = optionIndex;
    setAnswers(nextAnswers);
    persist(nextAnswers, currentIndex);
  }

  function goToNextQuestion() {
    const nextIndex = Math.min(currentIndex + 1, questions.length);
    setCurrentIndex(nextIndex);
    persist(answers, nextIndex);
  }

  function restart() {
    const reset = questions.map(() => null);
    setAnswers(reset);
    setCurrentIndex(0);
    persist(reset, 0);
  }

  const score = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);
  const results = useMemo(
    () =>
      questions.map(
        (q, i) => answers[i] !== null && answers[i] !== undefined && checkQuizAnswer(q, answers[i] as number)
      ),
    [questions, answers]
  );
  const isFinished = questions.length > 0 && currentIndex >= questions.length;

  useEffect(() => {
    if (user && todayIso && isFinished)
      void saveQuizResult(user.id, "daily", todayIso, score, questions.length);
  }, [user, todayIso, isFinished, score, questions.length]);

  return {
    isLoading: todayIso === null,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    currentAnswer: answers[currentIndex] ?? null,
    isFinished,
    score,
    results,
    dateIso: todayIso,
    selectAnswer,
    goToNextQuestion,
    restart
  };
}
