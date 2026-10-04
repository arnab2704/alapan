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
  //
  // That placeholder is drawn with CSS, not with the Unicode dotted-circle
  // character (U+25CC) + the mark as one string: U+25CC isn't in the
  // Bengali Unicode block, so Noto Sans Bengali (loaded with only the
  // "bengali" subset) has no glyph for it. The browser then has to pull it
  // from a fallback font, which splits the two characters into separate
  // font-shaping runs - breaking the GPOS mark-attachment that would
  // normally position the vowel sign on the circle, and in some fallback
  // fonts the dotted circle's own glyph doesn't even look like a circle.
  // Drawing the circle in CSS and the mark in the trusted Bengali font
  // sidesteps cross-font shaping entirely.
  const isCombiningMark = /^[া-ৌৗঁ-ঃ্]$/.test(letter);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("wordJaalTile", { letter })}
      className={
        variant === "available"
          ? "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-marigold-300 bg-gradient-to-b from-marigold-50 to-marigold-100 font-bengali text-2xl font-bold text-ink-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:h-14 sm:w-14"
          : "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-sindoor-300 bg-cream-50 font-bengali text-2xl font-bold text-sindoor-700 shadow-inner sm:h-14 sm:w-14"
      }
    >
      {isCombiningMark ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-6 w-6 rounded-full border-2 border-dotted border-current opacity-50 sm:h-7 sm:w-7"
        />
      ) : null}
      <span className="relative">{letter}</span>
    </button>
  );
}
