import { cellKey, getAt, getBonusType } from "./board";
import type { Board, FormedWord } from "./types";

export const FULL_RACK_BONUS = 25;

/**
 * Scores a single formed word: each cell contributes its tile's base
 * points, multiplied by a letter bonus if that cell was newly placed this
 * move and sits on a letter-bonus square. Word-bonus squares multiply the
 * word's entire total, and multiple word bonuses within one word stack
 * multiplicatively. Bonuses only ever apply the turn a tile first lands on
 * that square - reusing an already-placed tile in a later word never
 * re-triggers its bonus (the standard word-board convention).
 */
export function scoreFormedWord(board: Board, word: FormedWord, newlyPlacedKeys: Set<string>): number {
  let letterTotal = 0;
  let wordMultiplier = 1;

  for (const cell of word.cells) {
    const placed = getAt(board, cell.row, cell.col);
    const points = placed?.tile.points ?? 0;
    const key = cellKey(cell.row, cell.col);
    const bonus = newlyPlacedKeys.has(key) ? getBonusType(cell.row, cell.col, board.size) : null;

    let cellPoints = points;
    if (bonus === "letter2") cellPoints *= 2;
    if (bonus === "letter3") cellPoints *= 3;
    if (bonus === "word2") wordMultiplier *= 2;
    if (bonus === "word3") wordMultiplier *= 3;

    letterTotal += cellPoints;
  }

  return letterTotal * wordMultiplier;
}

/** Sum of every formed word's score in this move (see scoreFormedWord). */
export function scoreFormedWords(
  board: Board,
  formedWords: FormedWord[],
  newlyPlacedKeys: Set<string>
): number {
  return formedWords.reduce((sum, word) => sum + scoreFormedWord(board, word, newlyPlacedKeys), 0);
}

export function scoreMove(
  board: Board,
  formedWords: FormedWord[],
  newlyPlacedKeys: Set<string>,
  usedAllRackTiles: boolean
): number {
  const base = scoreFormedWords(board, formedWords, newlyPlacedKeys);
  return usedAllRackTiles ? base + FULL_RACK_BONUS : base;
}

export function dedupeCellKeys(formedWords: FormedWord[]): Set<string> {
  const keys = new Set<string>();
  for (const word of formedWords) {
    for (const cell of word.cells) keys.add(cellKey(cell.row, cell.col));
  }
  return keys;
}
