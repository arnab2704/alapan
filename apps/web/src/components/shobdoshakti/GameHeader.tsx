"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Link } from "@/i18n/navigation";

export interface GameHeaderProps {
  /** Omitted when the active mode already shows its own detailed ScorePanel (both modes do). */
  score?: number;
  onHelp: () => void;
}

/** Compact in-game header: title, optional live score, help trigger. Sits above the mode toggle. */
export function GameHeader({ score, onHelp }: GameHeaderProps) {
  const t = useTranslations("shobdoshakti");
  const tHelp = useTranslations("help");

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="font-bengaliDisplay text-2xl font-bold text-ink-900 sm:text-3xl">{t("heading")}</h1>
        <Link
          href="/play/shobdoshakti/how-to-play"
          className="text-xs text-ink-400 underline decoration-dotted hover:text-sindoor-600"
        >
          {tHelp("title")}
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {typeof score === "number" ? (
          <div className="rounded-full bg-cream-100 px-3 py-1 text-sm font-semibold text-sindoor-600">
            {t("score")} {toBengaliDigits(score)}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onHelp}
          aria-label={tHelp("trigger")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-cream-50 text-ink-600 hover:bg-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
        >
          <span aria-hidden="true">?</span>
        </button>
      </div>
    </div>
  );
}
