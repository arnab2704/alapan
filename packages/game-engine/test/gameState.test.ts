import { describe, expect, it } from "vitest";
import { createBoard } from "../src/board";
import { applyMove, initGame } from "../src/gameState";
import type { GameState, LetterDistribution } from "../src/types";

const distribution: LetterDistribution[] = [
  { token: "ক", count: 10, points: 1 },
  { token: "লা", count: 10, points: 2 },
  { token: "লম", count: 10, points: 3 }
];

const dictionary = (word: string) => ["কলা", "কলম"].includes(word);

describe("initGame", () => {
  it("deals a rack of the requested size and keeps the rest in the bag", () => {
    const state = initGame(distribution, { rackSize: 5, boardSize: 9 });
    expect(state.rack).toHaveLength(5);
    expect(state.bag).toHaveLength(30 - 5);
    expect(state.board.cells.size).toBe(0);
    expect(state.score).toBe(0);
  });
});

describe("applyMove", () => {
  it("rejects a move using tiles not in the rack", () => {
    const state = initGame(distribution, { rackSize: 5, boardSize: 9 });
    const fakeTile = { id: "not-in-rack", token: "ক", points: 1 };
    const result = applyMove(state, [{ row: 4, col: 4, tile: fakeTile }], dictionary);
    expect(result.ok).toBe(false);
    expect(result.state).toBe(state);
  });

  it("commits a valid move, updates score, and refills the rack", () => {
    const state = initGame(distribution, { rackSize: 7, boardSize: 9 });
    // Force known tiles into the rack so the move is deterministic regardless of shuffle order.
    const kaTile = { id: "ka-1", token: "ক", points: 1 };
    const laTile = { id: "la-1", token: "লা", points: 2 };
    state.rack[0] = kaTile;
    state.rack[1] = laTile;

    const result = applyMove(
      state,
      [
        { row: 4, col: 4, tile: kaTile },
        { row: 4, col: 5, tile: laTile }
      ],
      dictionary
    );

    expect(result.ok).toBe(true);
    expect(result.state.score).toBeGreaterThan(0);
    expect(result.state.rack).toHaveLength(7);
    expect(result.state.board.cells.size).toBe(2);
    expect(result.state.movesPlayed).toBe(1);
  });
});

describe("level-mode completion (single-target dictionary, no refill bag)", () => {
  // Mirrors apps/web's buildLevelEngineState: rack = exactly the target word's
  // tiles, empty bag, dictionary accepts only that one word.
  function levelState(): GameState {
    const kaTile = { id: "ka-1", token: "ক", points: 1 };
    const laTile = { id: "la-1", token: "লা", points: 2 };
    return {
      board: createBoard(15),
      bag: [],
      rack: [laTile, kaTile], // shuffled order - deliberately not the correct reading order
      score: 0,
      movesPlayed: 0,
      rackSize: 2
    };
  }
  const onlyTarget = (word: string) => word === "কলা";

  it("completes the level (empties the rack, awards the full-rack bonus) when placed in the correct order", () => {
    const state = levelState();
    const [laTile, kaTile] = state.rack;

    const result = applyMove(
      state,
      [
        { row: 7, col: 7, tile: kaTile },
        { row: 7, col: 8, tile: laTile }
      ],
      onlyTarget
    );

    expect(result.ok).toBe(true);
    expect(result.formedWords.map((w) => w.text)).toEqual(["কলা"]);
    expect(result.state.rack).toHaveLength(0);
    expect(result.pointsScored).toBeGreaterThan(0);
  });

  it("rejects the level's own tiles placed in the wrong order (does not spell the target)", () => {
    const state = levelState();
    const [laTile, kaTile] = state.rack;

    const result = applyMove(
      state,
      [
        { row: 7, col: 7, tile: laTile },
        { row: 7, col: 8, tile: kaTile }
      ],
      onlyTarget
    );

    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.code === "word_not_in_dictionary")).toBe(true);
  });
});
