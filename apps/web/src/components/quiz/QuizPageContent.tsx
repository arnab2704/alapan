"use client";

import { useTranslations } from "next-intl";
import { Container, SectionHeading } from "@alapon/ui";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResult } from "./QuizResult";
import { useDailyQuiz } from "./useDailyQuiz";

export function QuizPageContent() {
  const t = useTranslations("quiz");
  const quiz = useDailyQuiz();

  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading title={t("heading")} description={t("description")} />

      {quiz.isLoading ? (
        <div className="h-64 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700" aria-hidden="true" />
      ) : quiz.isFinished ? (
        <QuizResult
          score={quiz.score}
          total={quiz.questions.length}
          results={quiz.results}
          dateIso={quiz.dateIso}
          onRestart={quiz.restart}
        />
      ) : quiz.currentQuestion ? (
        <QuizQuestionCard
          question={quiz.currentQuestion}
          questionNumber={quiz.currentIndex + 1}
          totalQuestions={quiz.questions.length}
          selectedIndex={quiz.currentAnswer}
          onSelect={quiz.selectAnswer}
          onNext={quiz.goToNextQuestion}
          isLastQuestion={quiz.currentIndex === quiz.questions.length - 1}
        />
      ) : null}
    </Container>
  );
}
