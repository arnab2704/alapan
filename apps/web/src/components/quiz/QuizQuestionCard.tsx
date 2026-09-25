"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import type { QuizQuestion } from "@alapon/game-engine";
import { Badge, Card } from "@alapon/ui";

export interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
  isLastQuestion: boolean;
  /** Button label on the last question. Defaults to the daily quiz's "Today's result". */
  finishLabel?: string;
}

export function QuizQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelect,
  onNext,
  isLastQuestion,
  finishLabel
}: QuizQuestionCardProps) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const answered = selectedIndex !== null;

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <Badge tone="gold">{t(`categories.${question.category}`)}</Badge>
        <span className="text-xs font-medium text-ink-400">
          {t("questionProgress", { current: toDigits(questionNumber), total: toDigits(totalQuestions) })}
        </span>
      </div>

      <h3 className="font-bengaliDisplay mt-3 text-lg font-bold text-ink-900 dark:text-ink-50">
        {locale === "bn" ? question.questionBn : question.questionEn}
      </h3>

      <div
        className="mt-4 flex flex-col gap-2"
        role="radiogroup"
        aria-label={locale === "bn" ? question.questionBn : question.questionEn}
      >
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selectedIndex;
          const optionText = locale === "bn" ? option.textBn : option.textEn;

          const stateClass = !answered
            ? "border-ink-200 bg-cream-50 hover:border-sindoor-300 hover:bg-cream-100 dark:border-ink-600 dark:bg-ink-800"
            : isCorrect
              ? "border-shapla-500 bg-shapla-50 text-shapla-800 dark:bg-shapla-900/20 dark:text-shapla-200"
              : isSelected
                ? "border-sindoor-500 bg-sindoor-50 text-sindoor-800 dark:bg-sindoor-900/20 dark:text-sindoor-200"
                : "border-ink-100 bg-cream-50 text-ink-400 dark:border-ink-700 dark:bg-ink-800";

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={answered}
              onClick={() => onSelect(index)}
              className={`min-h-11 rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors disabled:cursor-default ${stateClass}`}
            >
              {optionText}
              {answered && isCorrect ? (
                <span aria-hidden="true" className="ml-2">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="mt-4 rounded-lg bg-cream-100 p-3 text-sm dark:bg-ink-900/40">
          <p
            role="status"
            className={`font-semibold ${selectedIndex === question.correctIndex ? "text-shapla-700 dark:text-shapla-300" : "text-sindoor-700 dark:text-sindoor-300"}`}
          >
            {selectedIndex === question.correctIndex ? t("correct") : t("incorrect")}
          </p>
          {selectedIndex !== question.correctIndex ? (
            <p className="mt-1 font-medium text-ink-800 dark:text-ink-100">
              {t("correctAnswerWas", {
                answer:
                  locale === "bn"
                    ? question.options[question.correctIndex].textBn
                    : question.options[question.correctIndex].textEn
              })}
            </p>
          ) : null}
          {(locale === "bn" ? question.explanationBn : question.explanationEn) ? (
            <p className="mt-1 text-ink-600 dark:text-ink-200">
              {locale === "bn" ? question.explanationBn : question.explanationEn}
            </p>
          ) : null}
          <button type="button" onClick={onNext} className="btn btn-primary mt-3">
            {isLastQuestion ? (finishLabel ?? t("resultHeading")) : t("next")}
          </button>
        </div>
      ) : null}
    </Card>
  );
}
