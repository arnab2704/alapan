"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Badge } from "@alapon/ui";

export interface LevelProgressProps {
  level: number;
  totalLevels: number;
  difficulty: string;
  combinationIndex: number;
  combinationCount: number;
}

const DIFFICULTY_LABELS_BN: Record<string, string> = {
  Beginner: "শুরু",
  Easy: "সহজ",
  "Lower-Intermediate": "মাঝারি-সহজ",
  Intermediate: "মাঝারি",
  "Intermediate-Advanced": "মাঝারি-কঠিন",
  "Upper-Intermediate": "উচ্চ-মাঝারি",
  Hard: "কঠিন",
  "Hard-Advanced": "খুব কঠিন",
  Expert: "বিশেষজ্ঞ",
  Legendary: "কিংবদন্তি"
};

export function LevelProgress({
  level,
  totalLevels,
  difficulty,
  combinationIndex,
  combinationCount
}: LevelProgressProps) {
  const t = useTranslations("shobdoshakti.level");
  const locale = useLocale();
  const difficultyLabel = locale === "bn" ? (DIFFICULTY_LABELS_BN[difficulty] ?? difficulty) : difficulty;
  const percent = combinationCount > 0 ? Math.round(((combinationIndex + 1) / combinationCount) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="festival">{t("levelLabel", { n: toBengaliDigits(level) })}</Badge>
          <Badge tone="muted">{difficultyLabel}</Badge>
        </div>
        <span className="text-xs text-ink-400">
          {toBengaliDigits(level)} / {toBengaliDigits(totalLevels)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={combinationIndex + 1}
        aria-valuemin={1}
        aria-valuemax={combinationCount}
        aria-label={t("combinationProgress", {
          current: toBengaliDigits(combinationIndex + 1),
          total: toBengaliDigits(combinationCount)
        })}
        className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sindoor-500 to-marigold-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-ink-400">
        {t("combinationProgress", {
          current: toBengaliDigits(combinationIndex + 1),
          total: toBengaliDigits(combinationCount)
        })}
      </p>
    </div>
  );
}
