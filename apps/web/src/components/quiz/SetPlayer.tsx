"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveQuizResult } from "@/lib/supabase/quizResults";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import {
  QUIZ_LEVELS,
  QUIZ_LEVEL_COUNT,
  QUIZ_SETS_PER_LEVEL,
  getNextQuizSet,
  isQuizSetUnlocked,
  passScoreFor
} from "@alapon/game-engine";
import type { QuizSetData } from "@alapon/game-engine";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { useQuizLevelProgress } from "./useQuizLevelProgress";
import { useQuizRun } from "./useQuizRun";

const primaryLink = "btn btn-primary";
const ghostButton = "btn btn-secondary";

export interface SetPlayerProps {
  level: number;
  set: number;
}

export function SetPlayer({ level, set }: SetPlayerProps) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const { isLoaded, progress, record } = useQuizLevelProgress();

  const [data, setData] = useState<QuizSetData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setFailed(false);
    fetch(`/api/quiz/set/${level}/${set}`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<QuizSetData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [level, set, attempt]);

  const levelName = locale === "bn" ? QUIZ_LEVELS[level - 1].nameBn : QUIZ_LEVELS[level - 1].nameEn;
  const title = t("set.title", { level: toDigits(level), set: toDigits(set) });
  const unlocked = isLoaded && isQuizSetUnlocked(progress, level, set);

  return (
    <Container className="py-8 sm:py-12">
      <Link
        href={`/quiz/level/${level}`}
        className="text-sm font-medium text-sindoor-600 underline decoration-dotted hover:text-sindoor-700"
      >
        ‹ {levelName}
      </Link>
      <SectionHeading className="mt-3" title={title} />

      {!isLoaded ? (
        <div className="h-64 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700" aria-busy="true" />
      ) : !unlocked ? (
        <Card className="flex flex-col items-center gap-2 py-10 text-center">
          <span aria-hidden="true" className="text-3xl">
            🔒
          </span>
          <h3 className="font-bengaliDisplay text-lg font-bold">{t("set.lockedTitle")}</h3>
          <p className="text-sm text-ink-600 dark:text-ink-200">{t("set.lockedBody")}</p>
          <ResumeLink progress={progress} label={t("set.goToNext")} />
        </Card>
      ) : failed ? (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <p role="alert" className="text-sm font-semibold text-sindoor-700">
            {t("set.error")}
          </p>
          <button type="button" className={ghostButton} onClick={() => setAttempt((n) => n + 1)}>
            {t("set.retryLoad")}
          </button>
        </Card>
      ) : !data ? (
        <div className="h-64 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700" aria-busy="true">
          <span className="sr-only">{t("set.loading")}</span>
        </div>
      ) : (
        <SetRun key={`${level}-${set}`} data={data} onFinish={record} />
      )}
    </Container>
  );
}

function ResumeLink({ progress, label }: { progress: Parameters<typeof getNextQuizSet>[0]; label: string }) {
  const next = getNextQuizSet(progress);
  return (
    <Link href={next ? `/quiz/level/${next.level}/${next.set}` : "/quiz"} className={`${primaryLink} mt-3`}>
      {label}
    </Link>
  );
}

interface SetRunProps {
  data: QuizSetData;
  onFinish: (level: number, set: number, score: number, total: number) => void;
}

function SetRun({ data, onFinish }: SetRunProps) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const run = useQuizRun(data.questions);
  const recordedRef = useRef(false);
  const total = data.questions.length;
  const { user } = useAuth();

  useEffect(() => {
    if (run.isFinished && !recordedRef.current) {
      recordedRef.current = true;
      onFinish(data.level, data.set, run.score, total);
      if (user) void saveQuizResult(user.id, "level", `L${data.level}-S${data.set}`, run.score, total);
    }
    if (!run.isFinished) recordedRef.current = false;
  }, [run.isFinished, run.score, total, data.level, data.set, onFinish, user]);

  if (!run.isFinished && run.currentQuestion) {
    return (
      <QuizQuestionCard
        question={run.currentQuestion}
        questionNumber={run.currentIndex + 1}
        totalQuestions={total}
        selectedIndex={run.currentAnswer}
        onSelect={run.selectAnswer}
        onNext={run.goToNextQuestion}
        isLastQuestion={run.currentIndex === total - 1}
        finishLabel={t("finishSet")}
      />
    );
  }

  const passed = run.score >= passScoreFor(total);
  const nextTarget =
    data.set < QUIZ_SETS_PER_LEVEL
      ? { level: data.level, set: data.set + 1 }
      : data.level < QUIZ_LEVEL_COUNT
        ? { level: data.level + 1, set: 1 }
        : null;

  return (
    <Card className="flex flex-col items-center gap-2 py-10 text-center">
      <span aria-hidden="true" className="text-4xl">
        {passed ? "🏆" : "📚"}
      </span>
      <h3 className="font-bengaliDisplay text-xl font-bold text-ink-900 dark:text-ink-50">
        {t("resultHeading")}
      </h3>
      <p className="font-bengaliDisplay text-3xl font-extrabold text-sindoor-600">
        {t("resultScore", { score: toDigits(run.score), total: toDigits(total) })}
      </p>
      <p role="status" className="max-w-sm text-sm text-ink-600 dark:text-ink-200">
        {passed ? t("set.resultPassed") : t("set.resultFailed")}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {passed && nextTarget ? (
          <Link href={`/quiz/level/${nextTarget.level}/${nextTarget.set}`} className={primaryLink}>
            {nextTarget.level !== data.level ? t("set.nextLevel") : t("set.nextSet")}
          </Link>
        ) : null}
        {passed && !nextTarget ? (
          <p className="text-sm font-semibold text-shapla-700 dark:text-shapla-300">{t("set.allDone")}</p>
        ) : null}
        <button type="button" className={passed ? ghostButton : primaryLink} onClick={run.restart}>
          {t("set.retry")}
        </button>
        <Link href={`/quiz/level/${data.level}`} className={ghostButton}>
          {t("set.backToLevel")}
        </Link>
      </div>
    </Card>
  );
}
