import { toBengaliDigits } from "@alapon/bengali";
import { LEVEL_ROWS } from "./data/quiz-bank";
import type { Opt, Row } from "./data/quiz-bank";
import type { QuizCategory, QuizOption, QuizQuestion } from "./data/quiz-questions";
import { hashString, mulberry32, withShuffledOptions } from "./quiz";
import { QUIZ_LEVEL_COUNT, QUIZ_SETS_PER_LEVEL, isValidQuizSet } from "./quizProgress";
import { shuffle } from "./tileBag";

const CATEGORY_BY_CODE: Record<string, QuizCategory> = {
  hi: "history",
  ge: "geography",
  cu: "culture",
  li: "literature",
  re: "religion",
  fe: "festival",
  la: "language",
  ar: "arts",
  pe: "people"
};

function toOption(option: Opt): QuizOption {
  // A bare string reads the same in both languages (numbers, years): only its digits are localised.
  if (typeof option === "string") return { textBn: toBengaliDigits(option), textEn: option };
  return { textBn: option[0], textEn: option[1] };
}

function expandRow(row: Row, level: number, index: number): QuizQuestion {
  const [code, questionBn, questionEn, ...options] = row;
  const category = CATEGORY_BY_CODE[code];
  if (!category) throw new Error(`Unknown quiz category code "${code}" in level ${level}, row ${index + 1}`);
  const id = `L${String(level).padStart(2, "0")}-${String(index + 1).padStart(3, "0")}`;
  // Authoring convention: the correct answer is written first, so correctIndex is 0 before shuffling.
  return { id, category, questionBn, questionEn, options: options.map(toOption), correctIndex: 0 };
}

const levelCache = new Map<number, QuizQuestion[]>();

/** A level's questions in a fixed, deterministic mixed order (so sets blend all categories rather than clustering by authoring order). */
function getLevelQuestions(level: number): QuizQuestion[] {
  const cached = levelCache.get(level);
  if (cached) return cached;
  const expanded = LEVEL_ROWS[level - 1].map((row, i) => expandRow(row, level, i));
  const mixed = shuffle(expanded, mulberry32(level * 7919));
  levelCache.set(level, mixed);
  return mixed;
}

/** Splits a level into 10 sets, spreading any remainder over the first sets (so every question is used, in sets of 10-12). */
function setBounds(total: number, set: number): { start: number; end: number } {
  const base = Math.floor(total / QUIZ_SETS_PER_LEVEL);
  const remainder = total % QUIZ_SETS_PER_LEVEL;
  const before = set - 1;
  const start = before * base + Math.min(before, remainder);
  const size = base + (set <= remainder ? 1 : 0);
  return { start, end: start + size };
}

export interface QuizSetData {
  level: number;
  set: number;
  questions: QuizQuestion[];
}

/**
 * One set of a level: a fixed group of questions with each question's
 * options deterministically reshuffled (seeded per question + set), so the
 * correct answer never sits at a predictable position.
 */
export function getQuizSet(level: number, set: number): QuizSetData {
  if (!isValidQuizSet(level, set)) {
    throw new RangeError(`Quiz set out of range: level ${level}, set ${set}`);
  }
  const all = getLevelQuestions(level);
  const { start, end } = setBounds(all.length, set);
  const questions = all
    .slice(start, end)
    .map((question) => withShuffledOptions(question, hashString(question.id) ^ (level * 131 + set)));
  return { level, set, questions };
}

export function getQuizLevelQuestionCount(level: number): number {
  if (!Number.isInteger(level) || level < 1 || level > QUIZ_LEVEL_COUNT) {
    throw new RangeError(`Quiz level out of range: ${level}`);
  }
  return LEVEL_ROWS[level - 1].length;
}

export function getTotalLevelQuizQuestions(): number {
  return LEVEL_ROWS.reduce((sum, rows) => sum + rows.length, 0);
}

/** Every level question (unshuffled options, correct answer first) - for data-integrity checks and tooling. */
export function getAllLevelQuizQuestions(): QuizQuestion[] {
  const all: QuizQuestion[] = [];
  for (let level = 1; level <= QUIZ_LEVEL_COUNT; level++) all.push(...getLevelQuestions(level));
  return all;
}
