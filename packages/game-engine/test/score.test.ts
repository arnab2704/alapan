import { describe, expect, it } from "vitest";
import { createBoard, getBonusType, withPlacement } from "../src/board";
import { FULL_RACK_BONUS, scoreMove } from "../src/score";
import type { FormedWord, PlacedTile } from "../src/types";

function tile(token: string, points: number) {
  return { id: `t_${token}_${Math.random()}`, token, points };
}

const noBonusCellKeys = new Set<string>();

describe("scoreMove", () => {
  it("sums letter points across the formed word's cells when no bonus square is involved", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক", 2) },
      { row: 4, col: 5, tile: tile("লা", 3) }
    ];
    const boardAfter = withPlacement(board, placed);
    const words: FormedWord[] = [
      {
        text: "কলা",
        tokens: ["ক", "লা"],
        cells: [
          { row: 4, col: 4 },
          { row: 4, col: 5 }
        ],
        direction: "across"
      }
    ];
    const newlyPlacedKeys = new Set(["4,4", "4,5"]);
    expect(scoreMove(boardAfter, words, newlyPlacedKeys, false)).toBe(5);
  });

  it("adds the full-rack bonus when the move empties the rack and bag", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [{ row: 4, col: 4, tile: tile("ক", 2) }];
    const boardAfter = withPlacement(board, placed);
    const words: FormedWord[] = [
      { text: "ক", tokens: ["ক"], cells: [{ row: 4, col: 4 }], direction: "across" }
    ];
    expect(scoreMove(boardAfter, words, new Set(["4,4"]), true)).toBe(2 + FULL_RACK_BONUS);
  });

  it("doubles a newly-placed tile's points on a letter2 bonus square", () => {
    // On a 15x15 board (center 7), (7,5) is onAxis at ring 2 -> letter2.
    expect(getBonusType(7, 5, 15)).toBe("letter2");

    const board = createBoard(15);
    const placed: PlacedTile[] = [
      { row: 7, col: 7, tile: tile("ক", 1) },
      { row: 7, col: 6, tile: tile("খ", 1) },
      { row: 7, col: 5, tile: tile("গ", 4) }
    ];
    const boardAfter = withPlacement(board, placed);
    const words: FormedWord[] = [
      {
        text: "কখগ",
        tokens: ["ক", "খ", "গ"],
        cells: [
          { row: 7, col: 7 },
          { row: 7, col: 6 },
          { row: 7, col: 5 }
        ],
        direction: "across"
      }
    ];
    const newlyPlacedKeys = new Set(["7,7", "7,6", "7,5"]);
    // 1 + 1 + (4 * 2) = 10
    expect(scoreMove(boardAfter, words, newlyPlacedKeys, false)).toBe(10);
  });

  it("applies a word3 bonus to the whole word only when that cell was newly placed", () => {
    // (7,10) is onDiagonal at ring 3 from center -> word2; use ring 5 for word3 instead: (12,12).
    expect(getBonusType(12, 12, 15)).toBe("word3");

    const board = createBoard(15);
    const placed: PlacedTile[] = [
      { row: 12, col: 12, tile: tile("ক", 2) },
      { row: 12, col: 13, tile: tile("খ", 3) }
    ];
    const boardAfter = withPlacement(board, placed);
    const words: FormedWord[] = [
      {
        text: "কখ",
        tokens: ["ক", "খ"],
        cells: [
          { row: 12, col: 12 },
          { row: 12, col: 13 }
        ],
        direction: "across"
      }
    ];

    // First placement: word3 bonus applies -> (2 + 3) * 3 = 15.
    expect(scoreMove(boardAfter, words, new Set(["12,12", "12,13"]), false)).toBe(15);

    // Same word, but neither cell was newly placed this move (tiles already on board) -> no bonus, plain sum.
    expect(scoreMove(boardAfter, words, noBonusCellKeys, false)).toBe(5);
  });
});
