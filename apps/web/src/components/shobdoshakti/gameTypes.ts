import type { GameState as EngineGameState, MoveError, Tile } from "@alapon/game-engine";

export type GameStatus = "idle" | "placing" | "invalid";

export interface PendingPlacement {
  row: number;
  col: number;
  tile: Tile;
}

/**
 * Free Play's UI-facing composite state (selection/last-move outcome)
 * wrapping the engine's own GameState (board/rack/bag/score). The engine
 * never knows about "selectedTile" - that's a presentation concern owned
 * here, per the React UI -> Game Engine -> Bengali Engine -> Dictionary
 * layering. Move-result copy (error/success text) is derived from
 * `status` + `lastErrors` + `lastFormedWords` by WordFeedback, which owns
 * translation - this state only carries the raw outcome data.
 *
 * Level Mode has its own, differently-shaped state - see wordJaalTypes.ts -
 * since it's a letter-palette word-finding game, not board placement.
 */
export interface FreePlayViewState {
  engine: EngineGameState | null;
  selectedTileId: string | null;
  pendingPlacements: PendingPlacement[];
  status: GameStatus;
  lastPointsScored: number | null;
  lastFormedWords: string[];
  lastErrors: MoveError[];
}
