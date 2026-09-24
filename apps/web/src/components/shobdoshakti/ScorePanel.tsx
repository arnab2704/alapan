"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";

export interface ScorePanelProps {
  score: number;
  tilesLeftInBag?: number;
}

export function ScorePanel({ score, tilesLeftInBag }: ScorePanelProps) {
  const t = useTranslations("shobdoshakti");

  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-200 bg-cream-100 px-4 py-3">
      <span className="text-sm font-medium text-ink-500">{t("score")}</span>
      <span className="font-bengaliDisplay text-2xl font-bold text-sindoor-600">
        {toBengaliDigits(score)}
      </span>
      {typeof tilesLeftInBag === "number" ? (
        <span className="text-xs text-ink-400">
          {toBengaliDigits(tilesLeftInBag)} {t("tilesLeft")}
        </span>
      ) : null}
    </div>
  );
}
