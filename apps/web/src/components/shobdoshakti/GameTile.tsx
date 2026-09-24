"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import type { Tile } from "@alapon/game-engine";

export type GameTileVisualState = "default" | "selected" | "placed" | "disabled";

export interface GameTileProps {
  tile: Tile;
  state?: GameTileVisualState;
  onClick?: () => void;
  size?: "sm" | "md";
}

/**
 * A single ShobdoShakti tile: Bengali akshara + point value. Used both in
 * the rack and (read-only) on placed board cells, so the visual language
 * stays identical in both places - see spec §7.
 */
export function GameTile({ tile, state = "default", onClick, size = "md" }: GameTileProps) {
  const t = useTranslations("shobdoshakti.a11y");
  const interactive = Boolean(onClick) && state !== "disabled" && state !== "placed";

  const sizeClass = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-lg sm:h-12 sm:w-12";
  const pointSizeClass = size === "sm" ? "text-[8px]" : "text-[9px]";

  const stateClass =
    state === "selected"
      ? "border-sindoor-500 bg-cream-100 shadow-md shadow-sindoor-900/15 -translate-y-0.5"
      : state === "placed"
        ? "border-ink-300 bg-cream-200"
        : state === "disabled"
          ? "border-ink-200 bg-cream-100 opacity-40"
          : "border-ink-300 bg-cream-200 hover:border-sindoor-300 hover:bg-cream-100";

  const Component = interactive ? "button" : "div";

  return (
    <Component
      type={interactive ? "button" : undefined}
      onClick={interactive ? onClick : undefined}
      disabled={state === "disabled"}
      aria-label={t("tile", { token: tile.token, points: toBengaliDigits(tile.points) })}
      aria-pressed={interactive ? state === "selected" : undefined}
      className={`relative flex shrink-0 flex-col items-center justify-center rounded-lg border-2 font-bengali font-semibold text-ink-900 transition-all duration-150 ${sizeClass} ${stateClass} ${
        interactive
          ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
          : ""
      }`}
    >
      <span aria-hidden="true">{tile.token}</span>
      <span
        aria-hidden="true"
        className={`absolute bottom-0.5 right-1 font-latin leading-none text-ink-500 ${pointSizeClass}`}
      >
        {tile.points}
      </span>
    </Component>
  );
}
