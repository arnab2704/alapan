/**
 * Level-quiz structure and progression rules - pure, data-free logic (the
 * large question bank lives in quizLevels.ts and must stay out of client
 * bundles; this module is safe to import anywhere).
 */

export const QUIZ_LEVEL_COUNT = 10;
export const QUIZ_SETS_PER_LEVEL = 10;
/** A set is passed with at least this fraction of its questions correct. */
export const QUIZ_PASS_FRACTION = 0.7;

export interface QuizLevelInfo {
  level: number;
  nameBn: string;
  nameEn: string;
}

export const QUIZ_LEVELS: QuizLevelInfo[] = [
  { level: 1, nameBn: "নবীন", nameEn: "Novice" },
  { level: 2, nameBn: "পথিক", nameEn: "Traveller" },
  { level: 3, nameBn: "অনুসন্ধানী", nameEn: "Explorer" },
  { level: 4, nameBn: "পাঠক", nameEn: "Reader" },
  { level: 5, nameBn: "জ্ঞানী", nameEn: "Learned" },
  { level: 6, nameBn: "বিদ্বান", nameEn: "Scholar" },
  { level: 7, nameBn: "পণ্ডিত", nameEn: "Pandit" },
  { level: 8, nameBn: "মনীষী", nameEn: "Sage" },
  { level: 9, nameBn: "বিশারদ", nameEn: "Master" },
  { level: 10, nameBn: "মহামনীষী", nameEn: "Grand Master" }
];

export interface QuizSetResult {
  bestScore: number;
  total: number;
  passed: boolean;
}

/** Best result per set, keyed "level-set" (both 1-indexed). */
export type QuizProgressMap = Record<string, QuizSetResult>;

export function quizSetKey(level: number, set: number): string {
  return `${level}-${set}`;
}

export function isValidQuizSet(level: number, set: number): boolean {
  return (
    Number.isInteger(level) &&
    Number.isInteger(set) &&
    level >= 1 &&
    level <= QUIZ_LEVEL_COUNT &&
    set >= 1 &&
    set <= QUIZ_SETS_PER_LEVEL
  );
}

export function passScoreFor(total: number): number {
  return Math.ceil(total * QUIZ_PASS_FRACTION);
}

/** Returns a new progress map with this attempt folded in - best score is kept, and a pass is never revoked. */
export function recordQuizSetResult(
  progress: QuizProgressMap,
  level: number,
  set: number,
  score: number,
  total: number
): QuizProgressMap {
  const key = quizSetKey(level, set);
  const previous = progress[key];
  const bestScore = Math.max(previous?.bestScore ?? 0, score);
  const passed = Boolean(previous?.passed) || score >= passScoreFor(total);
  return { ...progress, [key]: { bestScore, total, passed } };
}

export function isQuizSetPassed(progress: QuizProgressMap, level: number, set: number): boolean {
  return Boolean(progress[quizSetKey(level, set)]?.passed);
}

/** The set that must be passed before (level, set) unlocks, or null for the very first set. */
export function previousQuizSet(level: number, set: number): { level: number; set: number } | null {
  if (set > 1) return { level, set: set - 1 };
  if (level > 1) return { level: level - 1, set: QUIZ_SETS_PER_LEVEL };
  return null;
}

export function isQuizSetUnlocked(progress: QuizProgressMap, level: number, set: number): boolean {
  const previous = previousQuizSet(level, set);
  return previous === null || isQuizSetPassed(progress, previous.level, previous.set);
}

export function isQuizLevelUnlocked(progress: QuizProgressMap, level: number): boolean {
  return isQuizSetUnlocked(progress, level, 1);
}

export function countPassedSets(progress: QuizProgressMap, level: number): number {
  let passed = 0;
  for (let set = 1; set <= QUIZ_SETS_PER_LEVEL; set++) {
    if (isQuizSetPassed(progress, level, set)) passed += 1;
  }
  return passed;
}

/** The first set not yet passed, in play order - or null once every set of every level is passed. */
export function getNextQuizSet(progress: QuizProgressMap): { level: number; set: number } | null {
  for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) {
    for (let set = 1; set <= QUIZ_SETS_PER_LEVEL; set++) {
      if (!isQuizSetPassed(progress, level, set)) return { level, set };
    }
  }
  return null;
}
