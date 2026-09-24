"use client";

import { useTranslations } from "next-intl";
import type { Tile } from "@alapon/game-engine";
import { GameTile } from "./GameTile";

export interface TileRackProps {
  tiles: Tile[];
  selectedTileId: string | null;
  onSelect: (tileId: string) => void;
}

/** The player's available tiles. Horizontally scrolls on narrow screens rather than shrinking tiles below a tappable size (spec §20). */
export function TileRack({ tiles, selectedTileId, onSelect }: TileRackProps) {
  const t = useTranslations("shobdoshakti");

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-600">{t("rack")}</p>
      <div
        role="group"
        aria-label={t("rack")}
        className="flex flex-wrap justify-center gap-2 sm:justify-start"
      >
        {tiles.map((tile) => (
          <GameTile
            key={tile.id}
            tile={tile}
            state={tile.id === selectedTileId ? "selected" : "default"}
            onClick={() => onSelect(tile.id)}
          />
        ))}
      </div>
    </div>
  );
}
