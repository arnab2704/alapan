"use client";

import { useTranslations } from "next-intl";
import type { GameMode } from "./wordJaalTypes";

export interface GameModeToggleProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export function GameModeToggle({ mode, onChange }: GameModeToggleProps) {
  const t = useTranslations("shobdoshakti.tabs");

  return (
    <div
      role="tablist"
      aria-label={t("levelMode")}
      className="grid grid-cols-2 gap-1 rounded-full border border-ink-200 bg-cream-100 p-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "level"}
        onClick={() => onChange("level")}
        className={tabClass(mode === "level")}
      >
        {t("levelMode")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "free"}
        onClick={() => onChange("free")}
        className={tabClass(mode === "free")}
      >
        {t("freePlay")}
      </button>
    </div>
  );
}

function tabClass(active: boolean): string {
  const base = "min-h-10 rounded-full text-sm font-semibold transition-colors";
  return active ? `${base} bg-sindoor-500 text-white shadow-sm` : `${base} text-ink-600 hover:bg-cream-50`;
}
