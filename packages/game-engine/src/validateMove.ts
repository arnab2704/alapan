import { normalizeForDictionary } from "@alapon/bengali";
import { cellKey, getAt, getFormedWords, isInBounds, withPlacement } from "./board";
import type { Board, DictionaryLookup, MoveError, MoveValidationResult, PlacedTile } from "./types";

export interface ValidateMoveOptions {
  /** True when the board has no tiles on it yet (first move of the game). */
  isFirstMove: boolean;
}

export function validateMove(
  board: Board,
  newlyPlaced: PlacedTile[],
  dictionaryLookup: DictionaryLookup,
  options: ValidateMoveOptions
): MoveValidationResult {
  const errors: MoveError[] = [];

  if (newlyPlaced.length === 0) {
    return { valid: false, formedWords: [], errors: [{ code: "no_tiles" }] };
  }

  for (const p of newlyPlaced) {
    if (!isInBounds(board, p)) {
      errors.push({ code: "out_of_bounds", detail: `${p.row},${p.col}` });
    } else if (getAt(board, p.row, p.col)) {
      errors.push({ code: "cell_occupied", detail: `${p.row},${p.col}` });
    }
  }
  if (errors.length > 0) return { valid: false, formedWords: [], errors };

  const rows = new Set(newlyPlaced.map((p) => p.row));
  const cols = new Set(newlyPlaced.map((p) => p.col));
  const sameRow = rows.size === 1;
  const sameCol = cols.size === 1;
  if (!sameRow && !sameCol) {
    return { valid: false, formedWords: [], errors: [{ code: "not_straight_line" }] };
  }

  const boardAfter = withPlacement(board, newlyPlaced);

  // No gaps: the contiguous span between the min and max placed index must be fully occupied.
  if (sameRow) {
    const row = newlyPlaced[0].row;
    const colsSorted = newlyPlaced.map((p) => p.col).sort((a, b) => a - b);
    for (let c = colsSorted[0]; c <= colsSorted[colsSorted.length - 1]; c++) {
      if (!getAt(boardAfter, row, c)) {
        errors.push({ code: "gap_in_line" });
        break;
      }
    }
  } else {
    const col = newlyPlaced[0].col;
    const rowsSorted = newlyPlaced.map((p) => p.row).sort((a, b) => a - b);
    for (let r = rowsSorted[0]; r <= rowsSorted[rowsSorted.length - 1]; r++) {
      if (!getAt(boardAfter, r, col)) {
        errors.push({ code: "gap_in_line" });
        break;
      }
    }
  }
  if (errors.length > 0) return { valid: false, formedWords: [], errors };

  if (options.isFirstMove) {
    const center = Math.floor(board.size / 2);
    const touchesCenter = newlyPlaced.some((p) => p.row === center && p.col === center);
    if (!touchesCenter) {
      errors.push({ code: "must_cover_center" });
    }
  } else {
    const placedKeys = new Set(newlyPlaced.map((p) => cellKey(p.row, p.col)));
    const touchesExisting = newlyPlaced.some((p) =>
      [
        [p.row - 1, p.col],
        [p.row + 1, p.col],
        [p.row, p.col - 1],
        [p.row, p.col + 1]
      ].some(([r, c]) => !placedKeys.has(cellKey(r, c)) && getAt(board, r, c))
    );
    const partOfExistingLine =
      newlyPlaced.length > 1 &&
      getFormedWords(boardAfter, newlyPlaced).some((w) => w.cells.length > newlyPlaced.length);
    if (!touchesExisting && !partOfExistingLine) {
      errors.push({ code: "must_connect" });
    }
  }
  if (errors.length > 0) return { valid: false, formedWords: [], errors };

  const formedWords = getFormedWords(boardAfter, newlyPlaced);
  if (formedWords.length === 0) {
    return { valid: false, formedWords: [], errors: [{ code: "no_word_formed" }] };
  }

  for (const word of formedWords) {
    const key = normalizeForDictionary(word.text);
    if (!dictionaryLookup(key)) {
      errors.push({ code: "word_not_in_dictionary", detail: word.text });
    }
  }

  return { valid: errors.length === 0, formedWords, errors };
}
