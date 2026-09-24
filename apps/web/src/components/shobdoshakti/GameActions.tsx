"use client";

import { useTranslations } from "next-intl";

export interface GameActionsProps {
  hasPending: boolean;
  onSubmit: () => void;
  onClear: () => void;
  onNewGame: () => void;
}

const buttonBase =
  "min-h-11 inline-flex items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";
const primaryClass = `${buttonBase} bg-sindoor-500 text-white shadow-sm shadow-sindoor-900/20 hover:bg-sindoor-600 focus-visible:outline-sindoor-600`;
const ghostClass = `${buttonBase} border border-ink-300 bg-cream-50 text-ink-700 hover:bg-ink-100 focus-visible:outline-ink-400`;

/** Free Play's submit/clear/new-game action bar. */
export function GameActions({ hasPending, onSubmit, onClear, onNewGame }: GameActionsProps) {
  const t = useTranslations("shobdoshakti");

  return (
    <div className="flex flex-col gap-2">
      <button type="button" className={primaryClass} onClick={onSubmit} disabled={!hasPending}>
        {t("submit")}
      </button>
      <button type="button" className={ghostClass} onClick={onClear} disabled={!hasPending}>
        {t("reset")}
      </button>
      <button type="button" className={ghostClass} onClick={onNewGame}>
        {t("newGame")}
      </button>
    </div>
  );
}
