"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { getDailyQuiz, scoreQuiz } from "@alapon/game-engine";
import type { QuizQuestion } from "@alapon/game-engine";
import { Badge, Container } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { toLocalIsoDate } from "@/lib/formatDate";
import { readQuizProgress } from "@/lib/quizProgress";

interface DailyState {
  questions: QuizQuestion[];
  started: boolean;
  finished: boolean;
  score: number;
}

/** Homepage spotlight for today's quiz: a taste of one question, and where the visitor stands today. */
export function HomeDailyQuiz() {
  const t = useTranslations("quiz.homeDaily");
  const tCat = useTranslations("quiz.categories");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const [state, setState] = useState<DailyState | null>(null);

  useEffect(() => {
    const today = new Date();
    const questions = getDailyQuiz(today);
    const saved = readQuizProgress(toLocalIsoDate(today));
    const usable = saved && saved.answers.length === questions.length;
    setState({
      questions,
      started: Boolean(usable && saved.answers.some((a) => a !== null)),
      finished: Boolean(usable && saved.currentIndex >= questions.length),
      score: usable ? scoreQuiz(questions, saved.answers) : 0
    });
  }, []);

  const teaser = state?.questions[0];
  const cta = state?.finished ? t("viewResult") : state?.started ? t("resume") : t("play");

  return (
    <section className="border-b border-ink-100 bg-gradient-to-r from-sindoor-50 via-cream-50 to-marigold-50 py-10 dark:border-ink-700 dark:from-ink-800 dark:via-ink-900 dark:to-ink-800 sm:py-12">
      <Container>
        <div className="grid items-center gap-6 rounded-alpona border-2 border-sindoor-200 bg-cream-50 p-6 shadow-md shadow-sindoor-900/10 dark:border-sindoor-800 dark:bg-ink-800 md:grid-cols-[1.2fr_1fr] md:p-8">
          <div>
            <Badge tone="festival">{t("eyebrow")}</Badge>
            <h2 className="font-bengaliDisplay mt-3 text-3xl font-extrabold text-ink-900 dark:text-ink-50 sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">
              {t("meta", { count: toDigits(state?.questions.length ?? 5) })}
            </p>
            {state?.finished ? (
              <p role="status" className="mt-3 text-lg font-bold text-shapla-700 dark:text-shapla-300">
                {t("done", { score: toDigits(state.score), total: toDigits(state.questions.length) })}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/quiz/daily"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-sindoor-500 px-7 text-base font-semibold text-white shadow-sm shadow-sindoor-900/20 transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
              >
                {cta}
              </Link>
              <Link
                href="/quiz"
                className="text-sm font-semibold text-sindoor-600 underline decoration-dotted hover:text-sindoor-700"
              >
                {t("allQuizzes")}
              </Link>
            </div>
          </div>

          <div
            className="rounded-lg border border-ink-100 bg-cream-100/70 p-4 dark:border-ink-700 dark:bg-ink-900/40"
            aria-live="polite"
          >
            {teaser ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-ink-500">{t("teaser")}</span>
                  <Badge tone="gold">{tCat(teaser.category)}</Badge>
                </div>
                <p className="font-bengaliDisplay mt-2 text-lg font-bold text-ink-900 dark:text-ink-50">
                  {locale === "bn" ? teaser.questionBn : teaser.questionEn}
                </p>
              </>
            ) : (
              <div className="h-20 animate-pulse rounded bg-ink-100 dark:bg-ink-700" aria-hidden="true" />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
