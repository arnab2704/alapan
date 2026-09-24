"use client";

import { useTranslations } from "next-intl";
import { GameBoard } from "./GameBoard";
import { TileRack } from "./TileRack";
import { GameActions } from "./GameActions";
import { WordFeedback } from "./WordFeedback";
import { ScorePanel } from "./ScorePanel";
import { useFreePlayGame } from "./useFreePlayGame";

/**
 * The open 15x15 board mode. Desktop: board left (~65-70%), controls
 * right. Mobile: score -> board -> rack -> submit/secondary, achieved via
 * CSS grid-area reassignment at the lg: breakpoint (see spec §5/§20) so
 * mobile never inherits a squeezed-down desktop layout.
 */
export function FreePlayGame() {
  const t = useTranslations("shobdoshakti");
  const game = useFreePlayGame();

  const rackTilesAvailable = game.engine
    ? game.engine.rack.filter((tile) => !game.pendingPlacements.some((p) => p.tile.id === tile.id))
    : [];

  return (
    <div
      className="flex flex-col gap-4 lg:grid lg:gap-x-6 lg:gap-y-4"
      style={{
        gridTemplateAreas: '"board panel"',
        gridTemplateColumns: "minmax(0, 760px) minmax(280px, 1fr)"
      }}
    >
      <div className="lg:hidden">
        <ScorePanel score={game.engine?.score ?? 0} tilesLeftInBag={game.engine?.bag.length} />
      </div>

      <div style={{ gridArea: "board" }}>
        {game.isLoading || !game.engine ? (
          <div
            className="flex aspect-square w-full max-w-[760px] items-center justify-center rounded-md border border-ink-200 bg-cream-100 text-ink-400"
            aria-busy="true"
          >
            …
          </div>
        ) : (
          <GameBoard
            engine={game.engine}
            pendingPlacements={game.pendingPlacements}
            isFirstMove={game.isFirstMove}
            onCellActivate={(row, col) => {
              const hasPendingHere = game.pendingPlacements.some((p) => p.row === row && p.col === col);
              if (hasPendingHere) {
                game.returnPlacement(row, col);
              } else {
                game.placeSelectedTile(row, col);
              }
            }}
            ariaLabel={t("heading")}
          />
        )}
      </div>

      <div style={{ gridArea: "panel" }} className="flex flex-col gap-4">
        <div className="hidden lg:block">
          <ScorePanel score={game.engine?.score ?? 0} tilesLeftInBag={game.engine?.bag.length} />
        </div>

        {game.engine ? (
          <>
            <TileRack
              tiles={rackTilesAvailable}
              selectedTileId={game.selectedTileId}
              onSelect={game.selectTile}
            />
            <WordFeedback
              status={game.status}
              errors={game.lastErrors}
              formedWords={game.lastFormedWords}
              pointsScored={game.lastPointsScored}
            />
            <GameActions
              hasPending={game.pendingPlacements.length > 0}
              onSubmit={game.submitMove}
              onClear={game.clearPending}
              onNewGame={game.newFreeGame}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
