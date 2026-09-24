import { tokenizeToTiles } from "@alapon/bengali";
import type { LetterDistribution } from "./types";

export interface BuildDistributionOptions {
  /** Total tiles in the bag once counts are scaled. */
  totalTiles?: number;
  minCount?: number;
  maxPoints?: number;
}

/**
 * Derives a tile bag distribution from a word list by tokenising every word
 * into akshara units (via @alapon/bengali) and counting frequency: common
 * aksharas get more copies and fewer points, rare ones get fewer copies and
 * more points - the same principle Scrabble uses for letter frequency, but
 * driven by the actual dictionary instead of a hand-tuned table.
 */
export function buildDistributionFromWords(
  words: string[],
  options: BuildDistributionOptions = {}
): LetterDistribution[] {
  const totalTiles = options.totalTiles ?? 100;
  const minCount = options.minCount ?? 1;
  const maxPoints = options.maxPoints ?? 10;

  const frequency = new Map<string, number>();
  for (const word of words) {
    for (const token of tokenizeToTiles(word)) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }

  const entries = Array.from(frequency.entries());
  const totalOccurrences = entries.reduce((sum, [, count]) => sum + count, 0);
  if (totalOccurrences === 0) return [];

  const maxFreq = Math.max(...entries.map(([, count]) => count));

  return entries
    .map(([token, count]) => {
      const share = count / totalOccurrences;
      const tileCount = Math.max(minCount, Math.round(share * totalTiles));
      const rarity = 1 - count / maxFreq;
      const points = Math.max(1, Math.round(1 + rarity * (maxPoints - 1)));
      return { token, count: tileCount, points };
    })
    .sort((a, b) => b.count - a.count);
}
