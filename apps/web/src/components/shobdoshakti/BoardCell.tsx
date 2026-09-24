"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import type { BonusType, Tile } from "@alapon/game-engine";

export interface BoardCellProps {
  row: number;
  col: number;
  tile?: Tile;
  bonus: BonusType | null;
  isCenter: boolean;
  isPending: boolean;
  isFirstMove: boolean;
  onClick: () => void;
  tabIndex?: number;
  onFocus?: () => void;
}

const bonusLabel: Record<BonusType, string> = {
  letter2: "২",
  letter3: "৩",
  word2: "২×",
  word3: "৩×"
};

/** One 15x15 board square. Bonus squares are labeled with text (not color alone) so they're never color-only game state. */
export function BoardCell({
  row,
  col,
  tile,
  bonus,
  isCenter,
  isPending,
  isFirstMove,
  onClick,
  tabIndex,
  onFocus
}: BoardCellProps) {
  const t = useTranslations("shobdoshakti.a11y");
  const bonusA11y = bonus ? t(`bonus_${bonus}` as const) : null;

  const ariaLabel = tile
    ? t("cellWithTile", { row: toBengaliDigits(row + 1), col: toBengaliDigits(col + 1), token: tile.token })
    : bonusA11y
      ? t("cellWithBonus", { row: toBengaliDigits(row + 1), col: toBengaliDigits(col + 1), bonus: bonusA11y })
      : t("cell", { row: toBengaliDigits(row + 1), col: toBengaliDigits(col + 1) });

  return (
    <button
      type="button"
      role="gridcell"
      data-row={row}
      data-col={col}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cellClass(Boolean(tile), Boolean(bonus), isCenter, isPending)}
    >
      {tile ? (
        <>
          <span aria-hidden="true">{tile.token}</span>
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0.5 font-latin text-[7px] leading-none text-ink-500 sm:text-[8px]"
          >
            {tile.points}
          </span>
        </>
      ) : isCenter && isFirstMove ? (
        <span aria-hidden="true" className="text-sindoor-400">
          ★
        </span>
      ) : bonus ? (
        <span
          aria-hidden="true"
          className={bonus.startsWith("word") ? "text-sindoor-500/70" : "text-marigold-600/80"}
        >
          {bonusLabel[bonus]}
        </span>
      ) : null}
    </button>
  );
}

function cellClass(hasTile: boolean, hasBonus: boolean, isCenter: boolean, isPending: boolean): string {
  const base =
    "relative flex aspect-square items-center justify-center border font-bengali text-[10px] font-semibold transition-colors sm:text-xs focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sindoor-600";

  if (hasTile) {
    return `${base} ${
      isPending
        ? "border-sindoor-400 bg-cream-100 text-ink-900 shadow-inner"
        : "border-ink-300 bg-cream-200 text-ink-900"
    }`;
  }
  if (isCenter) {
    return `${base} border-sindoor-300 bg-sindoor-50`;
  }
  if (hasBonus) {
    return `${base} border-ink-200 bg-cream-100 hover:bg-cream-200`;
  }
  return `${base} border-ink-200 bg-cream-50 hover:bg-cream-100`;
}
