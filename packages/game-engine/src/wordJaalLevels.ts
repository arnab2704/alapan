import raw from "./data/shobdojaal-levels.json";

/**
 * শব্দজাল (Shobdojaal) - the "find every word you can build from these
 * letters" level campaign that replaced ShobdoShakti's original
 * single-word board-placement Level Mode. Framework-agnostic on purpose
 * (see levels.ts for why), so it stays reusable outside apps/web later.
 *
 * `letters` here are raw Bengali orthographic units (bare consonants,
 * independent vowels, dependent vowel signs, virama) - NOT
 * tokenizeBengali() akshara tiles. That's deliberate: this is a
 * letter-palette/spelling game (closer to how Bengali script is taught,
 * where vowel signs are shown as their own learnable unit with a
 * dotted-circle placeholder) rather than a tile-board game. Word
 * matching/scoring logic for this mode lives in wordJaal.ts and always
 * goes through @alapon/bengali's normalizeBengali() before comparing -
 * raw character *display* units are fine here, raw string comparison for
 * *correctness* never is.
 *
 * Source data was a third-party curated draft with a severe defect: ~47%
 * of target words were not actually spellable from their own puzzle's
 * letters (measured via packages/bengali/scripts/validate-shobdojaal-levels.ts).
 * Fixed via fix-shobdojaal-levels.ts, which regenerates `letters` as the
 * exact character multiset each combination's (cleaned, NFC-normalized)
 * `canForm` words require - the words are the real curated content, the
 * letters are mechanically derived from them.
 */
export interface WordJaalCombination {
  letters: string[];
  canForm: string[];
}

export interface WordJaalLevel {
  level: number;
  difficulty: string;
  focus: string;
  combinations: WordJaalCombination[];
}

interface WordJaalLevelsFile {
  game_name: string;
  total_levels: number;
  total_combinations: number;
  levels: WordJaalLevel[];
}

const data = raw as WordJaalLevelsFile;
const levelsByNumber = new Map(data.levels.map((entry) => [entry.level, entry]));

export const TOTAL_WORDJAAL_LEVELS = data.total_levels;

export function getWordJaalLevel(level: number): WordJaalLevel | undefined {
  return levelsByNumber.get(level);
}

export function getWordJaalCombination(
  level: number,
  combinationIndex: number
): WordJaalCombination | undefined {
  return levelsByNumber.get(level)?.combinations[combinationIndex];
}

export interface WordJaalLevelSummary {
  level: number;
  difficulty: string;
  focus: string;
  combinationCount: number;
}

export function getWordJaalLevelSummaries(): WordJaalLevelSummary[] {
  return data.levels.map((l) => ({
    level: l.level,
    difficulty: l.difficulty,
    focus: l.focus,
    combinationCount: l.combinations.length
  }));
}
