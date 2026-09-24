import type { Board, BonusType, BoardCell, Direction, FormedWord, PlacedTile } from "./types";

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function createBoard(size: number): Board {
  return { size, cells: new Map() };
}

export function getCenter(size: number): number {
  return Math.floor(size / 2);
}

/**
 * Bonus-square layout, generated algorithmically rather than reproduced
 * from any existing word-board game's published board (deliberately not
 * Scrabble's radiating diagonal/edge-line premium-square pattern - no
 * bonus cells appear on the outer border, at corners, or at edge
 * midpoints). Bonuses sit on concentric "rings" (Chebyshev distance from
 * center) restricted to the interior, sparse enough to keep the board
 * visually clean (~10% of cells). Pure function of (row, col, size) so ANY
 * board size stays symmetric and deterministic without storing a bonus map
 * on the Board itself.
 */
export function getBonusType(row: number, col: number, size: number): BonusType | null {
  const center = getCenter(size);
  const dr = Math.abs(row - center);
  const dc = Math.abs(col - center);
  if (dr === 0 && dc === 0) return null; // the start cell - marked separately, not a scoring multiplier

  const ring = Math.max(dr, dc);
  if (ring === 0 || ring >= center) return null; // keep the outer border plain

  const onDiagonal = dr === dc;
  const onAxis = dr === 0 || dc === 0;

  if (onDiagonal && ring === 5) return "word3";
  if (onDiagonal && (ring === 2 || ring === 3)) return "word2";
  if (onAxis && ring === 6) return "letter3";
  if (onAxis && (ring === 2 || ring === 4)) return "letter2";
  return null;
}

export function isInBounds(board: Board, cell: BoardCell): boolean {
  return cell.row >= 0 && cell.row < board.size && cell.col >= 0 && cell.col < board.size;
}

export function getAt(board: Board, row: number, col: number): PlacedTile | undefined {
  return board.cells.get(cellKey(row, col));
}

/** Pure: returns a new board with the given tiles merged in. Does not validate. */
export function withPlacement(board: Board, placed: PlacedTile[]): Board {
  const cells = new Map(board.cells);
  for (const p of placed) {
    cells.set(cellKey(p.row, p.col), p);
  }
  return { size: board.size, cells };
}

/**
 * For each newly placed tile, walks outward across and down to find the
 * full contiguous run of occupied cells it belongs to. Returns runs of
 * length >= 2 (deduplicated by direction + starting cell so a shared
 * row/col isn't reported twice).
 *
 * Exception: if the entire move is a single placed tile with no neighbor
 * in any direction, that lone tile IS reported as a length-1 word. Real
 * one-akshara Bengali words exist (মা, না, কি...), so a genre rule of
 * "words need 2+ letters" would make any such word permanently
 * unplaceable - notably, 2 of ShobdoShakti's 1000 levels have a
 * single-akshara target word. This does not loosen validation for
 * multi-tile moves: a tile that already belongs to a 2+ run in one
 * direction never also spawns a spurious 1-cell entry in the other
 * direction (existing behavior, unchanged) - the exception only fires
 * when literally nothing else was found.
 */
export function getFormedWords(boardAfterPlacement: Board, newlyPlaced: PlacedTile[]): FormedWord[] {
  const found = new Map<string, FormedWord>();

  for (const placed of newlyPlaced) {
    for (const direction of ["across", "down"] as Direction[]) {
      const dRow = direction === "down" ? 1 : 0;
      const dCol = direction === "across" ? 1 : 0;

      let startRow = placed.row;
      let startCol = placed.col;
      while (getAt(boardAfterPlacement, startRow - dRow, startCol - dCol)) {
        startRow -= dRow;
        startCol -= dCol;
      }

      const cells: BoardCell[] = [];
      const tokens: string[] = [];
      let row = startRow;
      let col = startCol;
      let cell = getAt(boardAfterPlacement, row, col);
      while (cell) {
        cells.push({ row, col });
        tokens.push(cell.tile.token);
        row += dRow;
        col += dCol;
        cell = getAt(boardAfterPlacement, row, col);
      }

      if (cells.length < 2) continue;

      const key = `${direction}:${startRow},${startCol}`;
      if (!found.has(key)) {
        found.set(key, { text: tokens.join(""), tokens, cells, direction });
      }
    }
  }

  if (found.size === 0 && newlyPlaced.length === 1) {
    const solo = newlyPlaced[0];
    found.set(`across:${solo.row},${solo.col}`, {
      text: solo.tile.token,
      tokens: [solo.tile.token],
      cells: [{ row: solo.row, col: solo.col }],
      direction: "across"
    });
  }

  return Array.from(found.values());
}
