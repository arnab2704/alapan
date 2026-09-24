"use client";

import { useTranslations } from "next-intl";

export interface WordJaalTileProps {
  letter: string;
  onClick: () => void;
  variant?: "available" | "guess";
}

/**
 * A single শব্দজাল letter button. Unlike GameTile (board-game akshara
 * tiles with a point value), these are raw Bengali orthographic units -
 * bare consonants, independent vowels, or dependent vowel signs shown with
 * their conventional dotted-circle placeholder - so there's no point badge
 * here. See wordJaalLevels.ts for why that's the right unit for this mode.
 */
export function WordJaalTile({ letter, onClick, variant = "available" }: WordJaalTileProps) {
  const t = useTranslations("shobdoshakti.a11y");
  // Vowel signs/virama/modifiers can't render meaningfully alone - show the
  // conventional dotted-circle placeholder used when teaching them in isolation.
  const isCombiningMark = /^[া-ৌৗঁ-ঃ্]$/.test(letter);
  const display = isCombiningMark ? `◌${letter}` : letter;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("wordJaalTile", { letter: display })}
      className={
        variant === "available"
          ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-marigold-300 bg-gradient-to-b from-marigold-50 to-marigold-100 font-bengali text-2xl font-bold text-ink-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:h-14 sm:w-14"
          : "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-sindoor-300 bg-cream-50 font-bengali text-2xl font-bold text-sindoor-700 shadow-inner sm:h-14 sm:w-14"
      }
    >
      {display}
    </button>
  );
}
