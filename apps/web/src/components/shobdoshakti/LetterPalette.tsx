"use client";

import { useTranslations } from "next-intl";
import { WordJaalTile } from "./WordJaalTile";
import type { WordJaalLetterTile } from "./wordJaalTypes";

export interface LetterPaletteProps {
  letters: WordJaalLetterTile[];
  onSelect: (tileId: string) => void;
}

export function LetterPalette({ letters, onSelect }: LetterPaletteProps) {
  const t = useTranslations("shobdoshakti.wordJaal");

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-600">{t("letters")}</p>
      <div role="group" aria-label={t("letters")} className="flex flex-wrap justify-center gap-2">
        {letters.map((tile) => (
          <WordJaalTile
            key={tile.id}
            letter={tile.letter}
            onClick={() => onSelect(tile.id)}
            variant="available"
          />
        ))}
      </div>
    </div>
  );
}
