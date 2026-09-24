import { describe, expect, it } from "vitest";
import { tokenizeToTiles } from "@alapon/bengali";
import { buildWordSeededBag } from "../src/wordSeededBag";

const WORDS = ["কলা", "কলম", "কথা", "মা", "ক্ষমা", "বিদ্যা", "সকাল"];
const pointsFor = () => 3;

describe("buildWordSeededBag", () => {
  it("keeps a whole word's tokens grouped together, so a prefix of the bag always spells a real word", () => {
    const bag = buildWordSeededBag(WORDS, pointsFor, { targetSize: 40 });
    // Whatever word landed first, its full token run must appear intact at the front.
    const maxWordLen = Math.max(...WORDS.map((w) => tokenizeToTiles(w).length));
    const matchesSomeWord = WORDS.some((w) => {
      const wTokens = tokenizeToTiles(w);
      const front = bag.slice(0, wTokens.length).map((t) => t.token);
      return front.join("") === wTokens.join("");
    });
    expect(maxWordLen).toBeGreaterThan(0); // sanity: WORDS is non-empty
    expect(matchesSomeWord).toBe(true);
  });

  it("produces roughly the requested total tile count", () => {
    const bag = buildWordSeededBag(WORDS, pointsFor, { targetSize: 100 });
    expect(bag.length).toBeGreaterThanOrEqual(100);
    expect(bag.length).toBeLessThan(100 + 10); // at most one extra group's worth of overshoot
  });

  it("every tile in the bag traces back to a real word's token", () => {
    const bag = buildWordSeededBag(WORDS, pointsFor, { targetSize: 50 });
    const allValidTokens = new Set(WORDS.flatMap((w) => tokenizeToTiles(w)));
    for (const tile of bag) {
      expect(allValidTokens.has(tile.token)).toBe(true);
    }
  });

  it("(regression) a small closed dictionary reliably yields a solvable first hand, unlike plain frequency sampling", () => {
    // With only 7 short words, a 7-tile front-of-bag draw should almost always
    // exactly match one word's full token set - this is the property that was
    // broken before (see packages/game-engine's history: a frequency-based bag
    // left ~80% of dealt racks unable to spell any dictionary word at all).
    let solvableCount = 0;
    const trials = 50;
    for (let i = 0; i < trials; i++) {
      const bag = buildWordSeededBag(WORDS, pointsFor, { targetSize: 60, rng: Math.random });
      const rackSize = 7;
      const rack = bag.slice(0, rackSize).map((t) => t.token);
      const counts = new Map<string, number>();
      for (const t of rack) counts.set(t, (counts.get(t) ?? 0) + 1);
      const solvable = WORDS.some((w) => {
        const need = new Map<string, number>();
        for (const t of tokenizeToTiles(w)) need.set(t, (need.get(t) ?? 0) + 1);
        return [...need].every(([t, n]) => (counts.get(t) ?? 0) >= n);
      });
      if (solvable) solvableCount++;
    }
    expect(solvableCount / trials).toBeGreaterThan(0.9);
  });
});
