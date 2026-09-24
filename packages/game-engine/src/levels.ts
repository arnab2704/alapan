import raw from "./data/shobdoshakti-levels.json";

/**
 * The 1,000-level ShobdoShakti word dataset. Framework-agnostic on purpose
 * (no Next.js/"server-only" dependency here) so it stays reusable outside
 * apps/web later (AI, multiplayer, mobile, tournaments - see docs). The
 * file is ~515KB, so callers embedding this package in a browser bundle
 * must keep the import behind a server boundary themselves - in apps/web
 * that boundary is `src/lib/wordLevels.ts`, guarded with "server-only",
 * plus the /api/shobdoshakti/* route handlers that only ever expose one
 * level (or the flat word list) to the client at a time.
 *
 * Word content is the supplied dataset, unmodified - no words were added,
 * removed or replaced. `orthographic_length_approx` and `contains_conjunct`
 * were regenerated from the real tokenizer (packages/bengali
 * tokenizeBengali), because the values as originally supplied were computed
 * by counting raw Unicode codepoints, which is exactly the anti-pattern
 * this codebase's Bengali-handling rules forbid (see
 * packages/bengali/scripts/validate-word-data.ts and fix-word-data.ts for
 * the discrepancy report and the regeneration script). Every level is
 * still honestly tagged `validation_status: candidate_requires_dictionary_crosscheck`
 * - this is curated draft vocabulary, not a linguistically verified
 * dictionary, and callers must not present it as verified.
 */
export interface WordLevel {
  level: number;
  difficulty: string;
  starting_letter: string;
  target_word: string;
  normalized_word: string;
  orthographic_length_approx: number;
  contains_conjunct: boolean;
  difficulty_score: number;
  category: string;
  validation_status: string;
  source: string;
  license_status: string;
}

interface WordLevelsFile {
  dataset: string;
  version: string;
  language: string;
  game: string;
  total_levels: number;
  levels: WordLevel[];
}

const data = raw as WordLevelsFile;
const levelsByNumber = new Map(data.levels.map((entry) => [entry.level, entry]));

export const TOTAL_LEVELS = data.total_levels;
export const DATASET_VERSION = data.version;

export function getLevel(level: number): WordLevel | undefined {
  return levelsByNumber.get(level);
}

export function getAllLevels(): WordLevel[] {
  return data.levels;
}

/** Every target word across all levels - used to seed Free Play's tile bag/dictionary. */
export function getAllTargetWords(): string[] {
  return data.levels.map((entry) => entry.target_word);
}
