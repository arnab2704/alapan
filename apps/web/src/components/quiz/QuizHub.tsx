"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import {
  QUIZ_LEVELS,
  QUIZ_SETS_PER_LEVEL,
  countPassedSets,
  getNextQuizSet,
  isQuizLevelUnlocked
} from "@alapon/game-engine";
import { Badge, Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { useQuizLevelProgress } from "./useQuizLevelProgress";

const primaryLink =
  "mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white shadow-sm shadow-sindoor-900/20 transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600";

export function QuizHub() {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const { isLoaded, progress } = useQuizLevelProgress();

  const next = getNextQuizSet(progress);
  const hasStarted = Object.keys(progress).length > 0;

  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading title={t("hub.heading")} description={t("hub.description")} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-marigold-400">
          <h3 className="font-bengaliDisplay text-lg font-semibold">{t("hub.dailyTitle")}</h3>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("hub.dailyDescription")}</p>
          <Link href="/quiz/daily" className={primaryLink}>
            {t("hub.playDaily")}
          </Link>
        </Card>

        <Card className="border-t-4 border-t-sindoor-400">
          <h3 className="font-bengaliDisplay text-lg font-semibold">{t("hub.levelsHeading")}</h3>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("hub.levelsDescription")}</p>
          {isLoaded ? (
            next ? (
              <Link href={`/quiz/level/${next.level}/${next.set}`} className={primaryLink}>
                {hasStarted ? t("hub.continue") : t("hub.startJourney")}
              </Link>
            ) : (
              <p className="mt-4 text-sm font-semibold text-shapla-700 dark:text-shapla-300">
                {t("hub.allDone")}
              </p>
            )
          ) : (
            <div
              className="mt-4 h-11 w-40 animate-pulse rounded-full bg-ink-100 dark:bg-ink-700"
              aria-hidden="true"
            />
          )}
        </Card>
      </div>

      <div className="mt-10">
        <SectionHeading title={t("hub.allLevels")} />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUIZ_LEVELS.map((info) => {
            const unlocked = !isLoaded || isQuizLevelUnlocked(progress, info.level);
            const passed = isLoaded ? countPassedSets(progress, info.level) : 0;
            const name = locale === "bn" ? info.nameBn : info.nameEn;
            const body = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={unlocked ? "festival" : "muted"}>
                    {t("hub.levelLabel", { n: toDigits(info.level) })}
                  </Badge>
                  {!unlocked ? <span className="text-xs text-ink-400">🔒 {t("hub.locked")}</span> : null}
                </div>
                <p className="font-bengaliDisplay mt-2 text-lg font-bold text-ink-900 dark:text-ink-50">
                  {name}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {t("hub.setsPassed", { passed: toDigits(passed), total: toDigits(QUIZ_SETS_PER_LEVEL) })}
                </p>
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sindoor-500 to-marigold-500"
                    style={{ width: `${(passed / QUIZ_SETS_PER_LEVEL) * 100}%` }}
                  />
                </div>
              </>
            );
            return (
              <li key={info.level}>
                {unlocked ? (
                  <Link
                    href={`/quiz/level/${info.level}`}
                    className="block rounded-alpona border border-ink-100 bg-cream-50 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-ink-700 dark:bg-ink-800"
                  >
                    {body}
                  </Link>
                ) : (
                  <div
                    aria-disabled="true"
                    className="rounded-alpona border border-ink-100 bg-cream-100/60 p-4 opacity-70 dark:border-ink-700 dark:bg-ink-900/40"
                  >
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Container>
  );
}
