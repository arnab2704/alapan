"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { buildChallengeQuery, shareGrid } from "@alapon/game-engine";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatGregorianDate } from "@/lib/formatDate";

interface ShareResultButtonProps {
  score: number;
  total: number;
  /** Per-question correctness. With `dateIso`, the share becomes a Wordle-style card plus a challenge link. */
  results?: boolean[];
  dateIso?: string;
}

/** Shares via the native share sheet when available, otherwise copies the text. */
export function ShareResultButton({ score, total, results, dateIso }: ShareResultButtonProps) {
  const t = useTranslations("quiz");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  async function share() {
    let text: string;
    let url: string;
    if (results && dateIso) {
      const query = buildChallengeQuery({
        date: dateIso,
        score,
        total,
        name: profile?.display_name ?? null
      });
      url = `${window.location.origin}/${locale}/quiz/challenge?${query}`;
      text = `${t("shareCard", {
        date: formatGregorianDate(dateIso, locale, toDigits),
        grid: shareGrid(results),
        score: toDigits(score),
        total: toDigits(total)
      })}\n${t("shareChallenge")}`;
    } else {
      url = window.location.origin + window.location.pathname;
      text = t("shareText", { score, total });
    }
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to recover.
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
      >
        {t("share")}
      </button>
      <span role="status" className="text-xs text-shapla-700 dark:text-shapla-300">
        {copied ? t("shareCopied") : ""}
      </span>
    </div>
  );
}
