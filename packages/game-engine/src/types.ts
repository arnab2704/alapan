export interface Tile {
  /** Unique instance id (two tiles can share the same token, e.g. two "ক"). */
  id: string;
  /** Akshara text as produced by @alapon/bengali tokenizeBengali, e.g. "ক্ষ". */
  token: string;
  points: number;
}

export interface LetterDistribution {
  token: string;
  count: number;
  points: number;
}

export interface BoardCell {
  row: number;
  col: number;
}

export interface PlacedTile extends BoardCell {
  tile: Tile;
}

export interface Board {
  size: number;
  cells: Map<string, PlacedTile>;
}

/** Board bonus square kinds. See board.ts `getBonusType` for the layout algorithm. */
export type BonusType = "letter2" | "letter3" | "word2" | "word3";

export type Direction = "across" | "down";

export interface FormedWord {
  text: string;
  tokens: string[];
  cells: BoardCell[];
  direction: Direction;
}

export type MoveErrorCode =
  | "no_tiles"
  | "out_of_bounds"
  | "cell_occupied"
  | "not_straight_line"
  | "gap_in_line"
  | "must_cover_center"
  | "must_connect"
  | "no_word_formed"
  | "word_not_in_dictionary"
  | "tiles_not_in_rack";

export interface MoveError {
  code: MoveErrorCode;
  /** Extra context for logs/interpolation, e.g. the offending word. Not itself localized. */
  detail?: string;
}

export interface MoveValidationResult {
  valid: boolean;
  formedWords: FormedWord[];
  errors: MoveError[];
}

export type DictionaryLookup = (normalizedWord: string) => boolean;

export interface GameState {
  board: Board;
  bag: Tile[];
  rack: Tile[];
  score: number;
  movesPlayed: number;
  rackSize: number;
}
