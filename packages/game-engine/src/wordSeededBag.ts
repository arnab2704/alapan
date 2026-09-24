import { tokenizeToTiles } from "@alapon/bengali";
import { shuffle } from "./tileBag";
import type { Tile } from "./types";

let counter = 0;
function nextId(): string {
  counter += 1;
  return `tile_${counter}_${Date.now().toString(36)}`;
}

export interface WordSeededBagOptions {
  /** Approximate total tile count. Default 200. */
  targetSize?: number;
  rng?: () => number;
}

/**
 * Builds a tile bag whose tiles are grouped by whole dictionary word (a
 * word's tokens stay adjacent, in reading order), with only the GROUP
 * order shuffled - never individual tiles within or across groups.
 *
 * Why: with a small CLOSED dictionary (ShobdoShakti's 1000 curated words,
 * not an open language dictionary with tens of thousands of entries), a
 * rack built from independent per-token frequency (buildDistributionFromWords
 * + a plain shuffle) has a low chance of being able to spell ANY dictionary
 * word at all - empirically ~20% of random 7-tile racks, even before board
 * placement rules (see packages/game-engine/check-solvability.ts). A real
 * Scrabble-style frequency bag only works because almost any handful of
 * common letters spells *something* in an open dictionary; that assumption
 * fails here.
 *
 * Word-grouping fixes this by construction: drawing the next N tiles off
 * the front of the bag very often yields one complete word's tokens
 * together (exactly how Level Mode's rack - seeded from one target word -
 * is always solvable, generalized to a shuffled sequence of many words so
 * Free Play keeps producing playable hands turn after turn, including on
 * refills, since drawTiles() just keeps consuming from the front and needs
 * no changes).
 */
export function buildWordSeededBag(
  words: string[],
  pointsFor: (token: string) => number,
  options: WordSeededBagOptions = {}
): Tile[] {
  const targetSize = options.targetSize ?? 200;
  const rng = options.rng ?? Math.random;

  // Bias toward shorter words so most groups comfortably fit within a 7-tile hand.
  const sorted = [...words].sort((a, b) => tokenizeToTiles(a).length - tokenizeToTiles(b).length);
  const shortPool = sorted.slice(0, Math.max(50, Math.floor(sorted.length * 0.6)));

  const groups: Tile[][] = [];
  let total = 0;
  let guard = 0;
  while (total < targetSize && guard < 5000) {
    guard += 1;
    const word = shortPool[Math.floor(rng() * shortPool.length)];
    const tokens = tokenizeToTiles(word);
    const group = tokens.map((token) => ({ id: nextId(), token, points: pointsFor(token) }));
    groups.push(group);
    total += group.length;
  }

  return shuffle(groups, rng).flat();
}
