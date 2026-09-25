"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { checkQuizAnswer, compareToChallenge, getDailyQuiz, scoreQuiz, shareGrid } from "@alapon/game-engine";
import type { QuizChallenge } from "@alapon/game-engine";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { ShareResultButton } from "@/components/ShareResultButton";
import { formatGregorianDate } from "@/lib/formatDate";
import { QuizQuestionCard } from "./QuizQuestionCard";

const primary = "btn btn-primary btn-lg";

function dateFromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Plays the daily quiz of a past day against a friend's score. Nothing here is saved. */
export function ChallengePlayer({ challenge }: { challenge: QuizChallenge }) {
  const t = useTranslations("challenge");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const questions = useMemo(() => getDailyQuiz(dateFromIso(challenge.date)), [challenge.date]);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Array<number | null>>(() => questions.map(() => null));
  const [index, setIndex] = useState(0);

  const name = challenge.name ?? t("aFriend");
  const dateText = formatGregorianDate(challenge.date, locale, toDigits);
  const finished = index >= questions.length;

  if (!started) {
    return (
      <Container className="max-w-xl py-10 sm:py-14">
        <SectionHeading
          title={t("title", { name })}
          description={t("intro", {
            name,
            date: dateText,
            score: toDigits(challenge.score),
            total: toDigits(challenge.total)
          })}
        />
        <Card className="flex flex-col items-center gap-4 border-t-4 border-t-marigold-400 py-8 text-center">
          <p className="font-bengaliDisplay text-5xl font-extrabold text-sindoor-600">
            {toDigits(challenge.score)}/{toDigits(challenge.total)}
          </p>
          <button type="button" onClick={() => setStarted(true)} className={primary}>
            {t("accept")}
          </button>
        </Card>
      </Container>
    );
  }

  if (finished) {
    const mine = scoreQuiz(questions, answers);
    const results = questions.map((q, i) => answers[i] !== null && checkQuizAnswer(q, answers[i] as number));
    const outcome = compareToChallenge(mine, challenge.score);
    return (
      <Container className="max-w-xl py-10 sm:py-14">
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <p aria-hidden="true" className="text-5xl">
            {outcome === "win" ? "🏆" : outcome === "tie" ? "🤝" : "💪"}
          </p>
          <h2 className="font-bengaliDisplay text-2xl font-extrabold">{t(outcome)}</h2>
          <p className="text-lg" aria-label={shareGrid(results)}>
            {shareGrid(results)}
          </p>
          <p className="font-semibold text-ink-700 dark:text-ink-100">
            {t("versus", {
              mine: toDigits(mine),
              name,
              theirs: toDigits(challenge.score),
              total: toDigits(challenge.total)
            })}
          </p>
          <ShareResultButton
            score={mine}
            total={questions.length}
            results={results}
            dateIso={challenge.date}
          />
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/quiz/daily" className={primary}>
              {t("playToday")}
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  const question = questions[index];
  return (
    <Container className="py-8 sm:py-12">
      <QuizQuestionCard
        question={question}
        questionNumber={index + 1}
        totalQuestions={questions.length}
        selectedIndex={answers[index]}
        onSelect={(choice) => {
          if (answers[index] !== null) return;
          setAnswers((prev) => prev.map((a, i) => (i === index ? choice : a)));
        }}
        onNext={() => setIndex((i) => i + 1)}
        isLastQuestion={index === questions.length - 1}
      />
    </Container>
  );
}
