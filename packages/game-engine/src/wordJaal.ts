import { normalizeBengali } from "@alapon/bengali";
import { FULL_RACK_BONUS } from "./score";
import type { WordJaalCombination } from "./wordJaalLevels";

/**
 * Per-character point table for শব্দজাল, keyed by raw Bengali orthographic
 * unit (not akshara tiles - see wordJaalLevels.ts). Roughly frequency-
 * informed: common independent vowels/consonants score low, rare
 * consonants and modifiers score higher. Vowel signs intentionally score 0
 * (they modify a base consonant rather than standing as their own unit),
 * matching how normal word-tile games don't double-charge for a letter's
 * pronunciation mark.
 */
export const WORDJAAL_TILE_SCORES: Record<string, number> = {
  অ: 1,
  আ: 1,
  ই: 1,
  উ: 1,
  এ: 1,
  ও: 1,
  ক: 1,
  ত: 1,
  ঋ: 2,
  খ: 2,
  গ: 2,
  চ: 2,
  ছ: 2,
  জ: 2,
  ট: 2,
  ঠ: 2,
  ড: 2,
  ঢ: 2,
  ণ: 2,
  থ: 2,
  দ: 2,
  ধ: 2,
  ন: 2,
  প: 2,
  ফ: 2,
  ব: 2,
  ভ: 2,
  ম: 2,
  য: 2,
  র: 2,
  ল: 2,
  শ: 2,
  ষ: 2,
  স: 2,
  হ: 2,
  ঈ: 4,
  ঊ: 4,
  ঐ: 4,
  ঔ: 4,
  ঘ: 5,
  ঝ: 5,
  ঞ: 5,
  ঙ: 6,
  ৎ: 6,
  // Combining marks (Unicode category Mc/Mn) can't be bareword object keys - quoted for esbuild.
  "ং": 8,
  "ঃ": 8,
  "ঁ": 10,
  "্": 0
};

/** Sum of per-character points, excluding vowel signs and virama (see table above). */
export function scoreWordJaalWord(word: string): number {
  let total = 0;
  for (const ch of Array.from(normalizeBengali(word))) {
    total += WORDJAAL_TILE_SCORES[ch] ?? 0;
  }
  return total;
}

/** True if `word`'s characters are all available within `letters` (respecting counts - a multiset check, not just "every character appears somewhere"). */
export function canFormWordFromLetters(word: string, letters: string[]): boolean {
  const available = new Map<string, number>();
  for (const l of letters) available.set(l, (available.get(l) ?? 0) + 1);

  const needed = new Map<string, number>();
  for (const ch of Array.from(normalizeBengali(word))) needed.set(ch, (needed.get(ch) ?? 0) + 1);

  for (const [ch, count] of needed) {
    if ((available.get(ch) ?? 0) < count) return false;
  }
  return true;
}

export type WordJaalGuessOutcome = "empty" | "already_found" | "not_in_list" | "correct";

export interface WordJaalGuessResult {
  outcome: WordJaalGuessOutcome;
  normalizedWord: string;
  /** 0 for anything but "correct", and 0 for a helped (revealed) word even when correct. */
  points: number;
  /** True when this word used every letter in the combination's rack. */
  usedFullRack: boolean;
}

/**
 * Pure rule check for one guess - no React, no DOM, no randomness. Mirrors
 * how validateMove/applyMove centralize the board game's rules outside any
 * component: the UI only ever calls this and renders the result.
 */
export function checkWordJaalGuess(
  combination: WordJaalCombination,
  guess: string,
  alreadyFound: string[],
  options: { isHelped?: boolean } = {}
): WordJaalGuessResult {
  const normalizedWord = normalizeBengali(guess);

  if (normalizedWord.length === 0) {
    return { outcome: "empty", normalizedWord, points: 0, usedFullRack: false };
  }
  if (alreadyFound.includes(normalizedWord)) {
    return { outcome: "already_found", normalizedWord, points: 0, usedFullRack: false };
  }
  if (!combination.canForm.includes(normalizedWord)) {
    return { outcome: "not_in_list", normalizedWord, points: 0, usedFullRack: false };
  }

  const usedFullRack = Array.from(normalizedWord).length === combination.letters.length;
  const points = options.isHelped
    ? 0
    : scoreWordJaalWord(normalizedWord) + (usedFullRack ? FULL_RACK_BONUS : 0);

  return { outcome: "correct", normalizedWord, points, usedFullRack };
}
