"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Card } from "@alapon/ui";
import { ShareResultButton } from "@/components/ShareResultButton";

export interface QuizResultProps {
  score: number;
  total: number;
  results?: boolean[];
  dateIso?: string | null;
  onRestart: () => void;
}

export function QuizResult({ score, total, results, dateIso, onRestart }: QuizResultProps) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);

  const ratio = total > 0 ? score / total : 0;
  const message = ratio >= 0.8 ? t("resultGreat") : ratio >= 0.5 ? t("resultGood") : t("resultTryAgain");
  const emoji = ratio >= 0.8 ? "🏆" : ratio >= 0.5 ? "👏" : "📚";

  return (
    <Card className="flex flex-col items-center gap-2 py-10 text-center">
      <span aria-hidden="true" className="text-4xl">
        {emoji}
      </span>
      <h3 className="font-bengaliDisplay text-xl font-bold text-ink-900 dark:text-ink-50">
        {t("resultHeading")}
      </h3>
      <p className="font-bengaliDisplay text-3xl font-extrabold text-sindoor-600">
        {t("resultScore", { score: toDigits(score), total: toDigits(total) })}
      </p>
      <p className="max-w-sm text-sm text-ink-600 dark:text-ink-200">{message}</p>
      <p className="text-xs text-ink-400">{t("comeBackTomorrow")}</p>
      <ShareResultButton score={score} total={total} results={results} dateIso={dateIso ?? undefined} />
      <button
        type="button"
        onClick={onRestart}
        className="mt-3 min-h-11 inline-flex items-center justify-center rounded-full border border-ink-300 bg-cream-50 px-6 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-400 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-100"
      >
        {t("restart")}
      </button>
    </Card>
  );
}
