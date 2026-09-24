import { describe, expect, it } from "vitest";
import { createBoard, withPlacement } from "../src/board";
import { validateMove } from "../src/validateMove";
import type { PlacedTile } from "../src/types";

function tile(token: string, points = 1) {
  return { id: `t_${token}_${Math.random()}`, token, points };
}

const acceptAll = () => true;
const dictionary = (word: string) => ["কলা", "কলম"].includes(word);

describe("validateMove", () => {
  it("accepts a valid first move covering the center", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 5, tile: tile("লা") }
    ];
    const result = validateMove(board, placed, dictionary, { isFirstMove: true });
    expect(result.valid).toBe(true);
    expect(result.formedWords[0].text).toBe("কলা");
  });

  it("rejects a first move that does not cover the center", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 0, col: 0, tile: tile("ক") },
      { row: 0, col: 1, tile: tile("লা") }
    ];
    const result = validateMove(board, placed, dictionary, { isFirstMove: true });
    expect(result.valid).toBe(false);
  });

  it("rejects a move with a gap in the line", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 6, tile: tile("লা") }
    ];
    const result = validateMove(board, placed, acceptAll, { isFirstMove: true });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "gap_in_line")).toBe(true);
  });

  it("rejects a word not found in the dictionary", () => {
    const board = createBoard(9);
    const placed: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("খ") },
      { row: 4, col: 5, tile: tile("গা") }
    ];
    const result = validateMove(board, placed, dictionary, { isFirstMove: true });
    expect(result.valid).toBe(false);
  });

  it("rejects a follow-up move that does not connect to existing tiles", () => {
    const board = createBoard(9);
    const first: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 5, tile: tile("লা") }
    ];
    const boardAfterFirst = withPlacement(board, first);

    const disconnected: PlacedTile[] = [
      { row: 0, col: 0, tile: tile("ক") },
      { row: 0, col: 1, tile: tile("লম") }
    ];
    const result = validateMove(boardAfterFirst, disconnected, dictionary, { isFirstMove: false });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "must_connect")).toBe(true);
  });

  it("accepts a single-tile first move when that lone tile is itself a valid word (e.g. মা)", () => {
    const board = createBoard(9);
    const oneAksharaDictionary = (word: string) => word === "মা";
    const placed: PlacedTile[] = [{ row: 4, col: 4, tile: tile("মা") }];
    const result = validateMove(board, placed, oneAksharaDictionary, { isFirstMove: true });
    expect(result.valid).toBe(true);
    expect(result.formedWords[0].text).toBe("মা");
  });

  it("accepts a follow-up move that extends an existing word", () => {
    const board = createBoard(9);
    const first: PlacedTile[] = [
      { row: 4, col: 4, tile: tile("ক") },
      { row: 4, col: 5, tile: tile("লা") }
    ];
    const boardAfterFirst = withPlacement(board, first);

    const second: PlacedTile[] = [{ row: 5, col: 4, tile: tile("লম") }];
    const result = validateMove(boardAfterFirst, second, dictionary, { isFirstMove: false });
    expect(result.valid).toBe(true);
    expect(result.formedWords.some((w) => w.text === "কলম")).toBe(true);
  });
});
