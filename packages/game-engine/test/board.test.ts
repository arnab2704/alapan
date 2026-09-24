import { describe, expect, it } from "vitest";
import { createBoard, getBonusType, getCenter, getFormedWords, withPlacement } from "../src/board";
import type { PlacedTile } from "../src/types";

function tile(token: string, points = 1) {
  return { id: `t_${token}_${Math.random()}`, token, points };
}

describe("getFormedWords", () => {
  it("reads an across word from two adjacent placed tiles", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 5, tile: tile("লা") }
    ];
    const boardAfter = withPlacement(board, placed);
    const words = getFormedWords(boardAfter, placed);
    expect(words).toHaveLength(1);
    expect(words[0].text).toBe("কলা");
    expect(words[0].direction).toBe("across");
  });

  it("detects both across and down words at an intersection", () => {
    const board = createBoard(9);
    const first: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 5, tile: tile("লা") }
    ];
    let boardAfter = withPlacement(board, first);

    const second: PlacedTile[] = [{ row: 5, col: 4, tile: tile("লম") }];
    boardAfter = withPlacement(boardAfter, second);

    const words = getFormedWords(boardAfter, second);
    expect(words.some((w) => w.direction === "down" && w.text === "কলম")).toBe(true);
  });

  it("reports a single isolated tile as a length-1 word (real one-akshara words exist, e.g. মা)", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [{ row: 4, col: 4, tile: tile("মা") }];
    const boardAfter = withPlacement(board, placed);
    const words = getFormedWords(boardAfter, placed);
    expect(words).toHaveLength(1);
    expect(words[0].text).toBe("মা");
  });

  it("does not spawn a spurious 1-cell word in the perpendicular direction for a multi-tile move", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 5, tile: tile("লা") }
    ];
    const boardAfter = withPlacement(board, placed);
    const words = getFormedWords(boardAfter, placed);
    // Only the across word "কলা" - neither tile has a down-neighbor, and that
    // must NOT be reported as two separate length-1 "words" needing validation.
    expect(words).toHaveLength(1);
    expect(words[0].direction).toBe("across");
  });
});

describe("getBonusType (15x15 board)", () => {
  const SIZE = 15;
  const center = getCenter(SIZE);

  it("has no bonus on the center start cell", () => {
    expect(getBonusType(center, center, SIZE)).toBeNull();
  });

  it("has no bonus anywhere on the outer border (avoids corner/edge-midpoint layouts)", () => {
    for (let i = 0; i < SIZE; i++) {
      expect(getBonusType(0, i, SIZE)).toBeNull();
      expect(getBonusType(SIZE - 1, i, SIZE)).toBeNull();
      expect(getBonusType(i, 0, SIZE)).toBeNull();
      expect(getBonusType(i, SIZE - 1, SIZE)).toBeNull();
    }
  });

  it("is symmetric under 90-degree rotation about the center", () => {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        // Rotate (row, col) 90 degrees about (center, center).
        const dRow = row - center;
        const dCol = col - center;
        const rotatedRow = center + dCol;
        const rotatedCol = center - dRow;
        expect(getBonusType(rotatedRow, rotatedCol, SIZE)).toBe(getBonusType(row, col, SIZE));
      }
    }
  });

  it("keeps bonus-cell density sparse (under 15% of the board)", () => {
    let bonusCount = 0;
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (getBonusType(row, col, SIZE)) bonusCount++;
      }
    }
    expect(bonusCount / (SIZE * SIZE)).toBeLessThan(0.15);
  });
});
