"use client";

import { useTranslations } from "next-intl";

export interface WordJaalActionsProps {
  hasGuess: boolean;
  onSubmit: () => void;
  onClear: () => void;
  onHelp: () => void;
  onSkip: () => void;
}

const buttonBase =
  "min-h-11 inline-flex items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";
const primaryClass = `${buttonBase} bg-sindoor-500 text-white shadow-sm shadow-sindoor-900/20 hover:bg-sindoor-600 focus-visible:outline-sindoor-600`;
const ghostClass = `${buttonBase} border border-ink-300 bg-cream-50 text-ink-700 hover:bg-ink-100 focus-visible:outline-ink-400`;

export function WordJaalActions({ hasGuess, onSubmit, onClear, onHelp, onSkip }: WordJaalActionsProps) {
  const t = useTranslations("shobdoshakti.wordJaal");

  return (
    <div className="flex flex-col gap-2">
      <button type="button" className={primaryClass} onClick={onSubmit} disabled={!hasGuess}>
        {t("playWord")}
      </button>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className={ghostClass} onClick={onClear} disabled={!hasGuess}>
          {t("clear")}
        </button>
        <button type="button" className={ghostClass} onClick={onHelp}>
          {t("help")}
        </button>
        <button type="button" className={ghostClass} onClick={onSkip}>
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
