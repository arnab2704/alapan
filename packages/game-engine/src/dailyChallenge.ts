import { mulberry32 } from "./quiz";
import { TOTAL_WORDJAAL_LEVELS, getWordJaalLevel } from "./wordJaalLevels";

export type DailyDifficulty = "easy" | "medium" | "hard";

export interface DailyRoundSpec {
  level: number;
  /** Index of the combination inside its level. */
  index: number;
}

export interface DailyChallengeSpec {
  /** ISO yyyy-mm-dd. */
  date: string;
  difficulty: DailyDifficulty;
  rounds: DailyRoundSpec[];
  source: "generated" | "scheduled";
}

export interface DailyChallengeOverride {
  rounds: DailyRoundSpec[];
  difficulty?: DailyDifficulty;
}

export const DAILY_ROUNDS = 3;
const EPOCH = Date.UTC(2026, 0, 1);

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return { y, m, d };
}

export function isValidChallengeDate(iso: string): boolean {
  return parseIso(iso) !== null;
}

/** Sunday = 0 ... Saturday = 6, from the calendar date itself (no timezone involved). */
function weekday(iso: string): number {
  const p = parseIso(iso)!;
  return new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
}

function dayIndex(iso: string): number {
  const p = parseIso(iso)!;
  return Math.round((Date.UTC(p.y, p.m - 1, p.d) - EPOCH) / 86_400_000);
}

/** Starting level by weekday: gentle early in the week, harder towards the weekend, medium on Sunday. */
const BASE_LEVEL_BY_WEEKDAY = [3, 1, 2, 3, 4, 5, 6];

export function difficultyForLevel(level: number): DailyDifficulty {
  return level <= 2 ? "easy" : level <= 4 ? "medium" : "hard";
}

/**
 * Picks the three puzzles of a day. Deterministic from the date, so everyone gets the same
 * challenge without a server. Round 1 starts at the weekday's base level and each round is one
 * level harder. Combinations with at least three findable words are preferred so a round has
 * something to discover. An editor-scheduled override (already validated) replaces the pick.
 */
export function getDailyChallengeSpec(
  iso: string,
  override?: DailyChallengeOverride | null
): DailyChallengeSpec {
  if (!parseIso(iso)) throw new Error(`Invalid challenge date: ${iso}`);

  if (override && override.rounds.length > 0 && override.rounds.every(isRoundAvailable)) {
    return {
      date: iso,
      difficulty: override.difficulty ?? difficultyForLevel(override.rounds[0].level),
      rounds: override.rounds,
      source: "scheduled"
    };
  }

  const baseLevel = BASE_LEVEL_BY_WEEKDAY[weekday(iso)];
  const day = dayIndex(iso);
  const rounds: DailyRoundSpec[] = [];
  for (let round = 0; round < DAILY_ROUNDS; round++) {
    const level = Math.min(baseLevel + round, TOTAL_WORDJAAL_LEVELS);
    const data = getWordJaalLevel(level);
    const combos = data?.combinations ?? [];
    const rich = combos.map((c, i) => ({ c, i })).filter(({ c }) => c.canForm.length >= 3);
    const pool = rich.length > 0 ? rich.map((r) => r.i) : combos.map((_, i) => i);
    const rng = mulberry32((day * 131 + round * 7919) >>> 0);
    rounds.push({ level, index: pool[Math.floor(rng() * pool.length)] ?? 0 });
  }
  return { date: iso, difficulty: difficultyForLevel(baseLevel), rounds, source: "generated" };
}

/** True when the level and combination index exist. */
export function isRoundAvailable(round: DailyRoundSpec): boolean {
  const level = getWordJaalLevel(round.level);
  return Boolean(
    level && Number.isInteger(round.index) && round.index >= 0 && round.index < level.combinations.length
  );
}

export interface DailyRoundContent {
  level: number;
  index: number;
  letters: string[];
  canForm: string[];
}

export interface DailyChallengeContent {
  date: string;
  difficulty: DailyDifficulty;
  source: "generated" | "scheduled";
  rounds: DailyRoundContent[];
}

/** The spec with each round's letters and findable words filled in. */
export function resolveDailyChallenge(
  iso: string,
  override?: DailyChallengeOverride | null
): DailyChallengeContent {
  const spec = getDailyChallengeSpec(iso, override);
  return {
    date: spec.date,
    difficulty: spec.difficulty,
    source: spec.source,
    rounds: spec.rounds.map((r) => {
      const combo = getWordJaalLevel(r.level)!.combinations[r.index];
      return { level: r.level, index: r.index, letters: combo.letters, canForm: combo.canForm };
    })
  };
}

export interface DailyResultSummary {
  score: number;
  /** Every word found, in the order played, across all rounds. */
  wordsPlayed: string[];
  /** The highest-scoring word (ties: the longer one), or null when nothing was found. */
  bestWord: string | null;
  totalWords: number;
  roundsCompleted: number;
  hintsUsed: number;
}

/** Turns what a player found into the result summary. `scoreWord` is the game's per-word scorer. */
export function summarizeDailyResult(
  content: DailyChallengeContent,
  foundByRound: string[][],
  score: number,
  hintsUsed: number,
  scoreWord: (word: string) => number
): DailyResultSummary {
  const wordsPlayed = foundByRound.flat();
  let bestWord: string | null = null;
  for (const word of wordsPlayed) {
    if (
      bestWord === null ||
      scoreWord(word) > scoreWord(bestWord) ||
      (scoreWord(word) === scoreWord(bestWord) && Array.from(word).length > Array.from(bestWord).length)
    ) {
      bestWord = word;
    }
  }
  return {
    score,
    wordsPlayed,
    bestWord,
    totalWords: content.rounds.reduce((sum, r) => sum + r.canForm.length, 0),
    roundsCompleted: content.rounds.filter((r, i) => (foundByRound[i]?.length ?? 0) >= r.canForm.length)
      .length,
    hintsUsed
  };
}
