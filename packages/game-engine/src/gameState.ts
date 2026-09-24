import { cellKey, createBoard, withPlacement } from "./board";
import { createTileBag, drawTiles } from "./tileBag";
import { scoreMove } from "./score";
import { validateMove } from "./validateMove";
import type {
  DictionaryLookup,
  FormedWord,
  GameState,
  LetterDistribution,
  MoveError,
  PlacedTile
} from "./types";

export interface InitGameOptions {
  boardSize?: number;
  rackSize?: number;
  rng?: () => number;
}

export function initGame(distribution: LetterDistribution[], options: InitGameOptions = {}): GameState {
  const boardSize = options.boardSize ?? 15;
  const rackSize = options.rackSize ?? 7;
  const bag = createTileBag(distribution, options.rng);
  const { drawn, remaining } = drawTiles(bag, rackSize);

  return {
    board: createBoard(boardSize),
    bag: remaining,
    rack: drawn,
    score: 0,
    movesPlayed: 0,
    rackSize
  };
}

export interface ApplyMoveResult {
  ok: boolean;
  state: GameState;
  errors: MoveError[];
  pointsScored: number;
  formedWords: FormedWord[];
}

/**
 * Applies a move if valid: commits tiles to the board, removes them from the
 * rack, refills from the bag, and adds the score. Returns the unchanged
 * state plus errors if the move is invalid - never mutates the input state.
 */
export function applyMove(
  state: GameState,
  newlyPlaced: PlacedTile[],
  dictionaryLookup: DictionaryLookup
): ApplyMoveResult {
  const usedTileIds = new Set(newlyPlaced.map((p) => p.tile.id));
  const rackIds = new Set(state.rack.map((t) => t.id));
  const allFromRack = [...usedTileIds].every((id) => rackIds.has(id));
  if (!allFromRack) {
    return { ok: false, state, errors: [{ code: "tiles_not_in_rack" }], pointsScored: 0, formedWords: [] };
  }

  const result = validateMove(state.board, newlyPlaced, dictionaryLookup, {
    isFirstMove: state.board.cells.size === 0
  });

  if (!result.valid) {
    return { ok: false, state, errors: result.errors, pointsScored: 0, formedWords: [] };
  }

  const newBoard = withPlacement(state.board, newlyPlaced);
  const remainingRack = state.rack.filter((t) => !usedTileIds.has(t.id));
  const usedAllRackTiles = remainingRack.length === 0 && state.bag.length === 0;
  const newlyPlacedKeys = new Set(newlyPlaced.map((p) => cellKey(p.row, p.col)));
  const pointsScored = scoreMove(newBoard, result.formedWords, newlyPlacedKeys, usedAllRackTiles);

  const need = state.rackSize - remainingRack.length;
  const { drawn, remaining: newBag } = drawTiles(state.bag, need);

  const nextState: GameState = {
    board: newBoard,
    bag: newBag,
    rack: [...remainingRack, ...drawn],
    score: state.score + pointsScored,
    movesPlayed: state.movesPlayed + 1,
    rackSize: state.rackSize
  };

  return { ok: true, state: nextState, errors: [], pointsScored, formedWords: result.formedWords };
}
