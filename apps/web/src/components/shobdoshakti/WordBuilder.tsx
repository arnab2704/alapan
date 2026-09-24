"use client";

import { useTranslations } from "next-intl";
import { WordJaalTile } from "./WordJaalTile";
import type { WordJaalGuessStatus, WordJaalLetterTile } from "./wordJaalTypes";

export interface WordBuilderProps {
  tiles: WordJaalLetterTile[];
  status: WordJaalGuessStatus;
  onRemoveTile: (tileId: string) => void;
}

/** The word currently being built - tap a placed letter to remove it. */
export function WordBuilder({ tiles, status, onRemoveTile }: WordBuilderProps) {
  const t = useTranslations("shobdoshakti.wordJaal");

  const borderClass =
    status === "correct"
      ? "border-shapla-400 bg-shapla-50"
      : status === "already_found" || status === "not_in_list" || status === "empty"
        ? "border-sindoor-400 bg-sindoor-50"
        : "border-ink-200 bg-cream-100";

  return (
    <div
      role="status"
      aria-label={t("currentWord")}
      className={`flex min-h-16 w-full flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-2 transition-colors ${borderClass}`}
    >
      {tiles.length === 0 ? (
        <span className="text-sm text-ink-400">{t("typeWordHint")}</span>
      ) : (
        tiles.map((tile) => (
          <WordJaalTile
            key={tile.id}
            letter={tile.letter}
            onClick={() => onRemoveTile(tile.id)}
            variant="guess"
          />
        ))
      )}
    </div>
  );
}
