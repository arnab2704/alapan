"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { QUIZ_LEVELS, QUIZ_SETS_PER_LEVEL, isQuizSetUnlocked, quizSetKey } from "@alapon/game-engine";
import { Badge, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { useQuizLevelProgress } from "./useQuizLevelProgress";

export interface LevelSetsProps {
  level: number;
}

export function LevelSets({ level }: LevelSetsProps) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const { isLoaded, progress } = useQuizLevelProgress();

  const info = QUIZ_LEVELS[level - 1];
  const name = locale === "bn" ? info.nameBn : info.nameEn;
  const sets = Array.from({ length: QUIZ_SETS_PER_LEVEL }, (_, i) => i + 1);

  return (
    <Container className="py-8 sm:py-12">
      <Link
        href="/quiz"
        className="text-sm font-medium text-sindoor-600 underline decoration-dotted hover:text-sindoor-700"
      >
        ‹ {t("level.back")}
      </Link>
      <SectionHeading
        className="mt-3"
        eyebrow={t("hub.levelLabel", { n: toDigits(level) })}
        title={name}
        description={t("level.passRule")}
      />
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sets.map((set) => {
          const unlocked = isLoaded && isQuizSetUnlocked(progress, level, set);
          const result = progress[quizSetKey(level, set)];
          const label = t("level.setLabel", { n: toDigits(set) });
          const inner = (
            <>
              <p className="font-bengaliDisplay text-base font-bold text-ink-900 dark:text-ink-50">{label}</p>
              {result?.passed ? <Badge tone="gold">{t("level.passedBadge")}</Badge> : null}
              {result ? (
                <p className="mt-1 text-xs text-ink-500">
                  {t("level.best", { score: toDigits(result.bestScore), total: toDigits(result.total) })}
                </p>
              ) : unlocked ? (
                <p className="mt-1 text-xs font-medium text-sindoor-600">{t("level.play")}</p>
              ) : (
                <p className="mt-1 text-xs text-ink-400">🔒 {t("level.lockedHint")}</p>
              )}
            </>
          );
          return (
            <li key={set}>
              {unlocked ? (
                <Link
                  href={`/quiz/level/${level}/${set}`}
                  aria-label={label}
                  className="block h-full rounded-alpona border border-ink-100 bg-cream-50 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-ink-700 dark:bg-ink-800"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className="h-full rounded-alpona border border-ink-100 bg-cream-100/60 p-4 opacity-70 dark:border-ink-700 dark:bg-ink-900/40"
                >
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
