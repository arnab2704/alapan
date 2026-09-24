import { tokenizeToTiles } from "@alapon/bengali";
import { LEARN_UNITS } from "./data/learn-curriculum";
import type { LearnItem, LearnKind, LearnLesson, LearnUnit } from "./data/learn-curriculum";
import { shuffle } from "./tileBag";

export type { LearnItem, LearnKind, LearnLesson, LearnUnit };

export interface LearnText {
  text: string;
  /** True when `text` is Bengali script (so the UI can pick a Bengali font and speech). */
  bn: boolean;
}

export type ChooseQuestion =
  "whichRoman" | "whichLetter" | "whichMeaning" | "whichWord" | "whichNumberWord" | "whichNumeral";

export interface FlashExercise {
  type: "flash";
  itemId: string;
  item: LearnItem;
}

export interface ChooseExercise {
  type: "choose";
  itemId: string;
  question: ChooseQuestion;
  prompt: LearnText & { sub?: string };
  /** Text to read aloud, if any. */
  speak?: string;
  options: LearnText[];
  correctIndex: number;
}

export interface ExampleExercise {
  type: "example";
  itemId: string;
  relation: "starts" | "contains";
  prompt: LearnText & { sub: string };
  speak: string;
  options: LearnText[];
  correctIndex: number;
}

export interface MatchExercise {
  type: "match";
  pairs: Array<{ id: string; left: LearnText; right: LearnText }>;
  /** Pair ids in the order the right-hand column is shown. */
  rightOrder: string[];
}

export interface BuildExercise {
  type: "build";
  itemId: string;
  meaning: string;
  target: string;
  /** The word's tiles in the correct order. */
  answer: string[];
  /** The same tiles, shuffled. Each has a unique id because tiles can repeat. */
  tiles: Array<{ id: number; text: string }>;
}

export type LearnExercise = FlashExercise | ChooseExercise | ExampleExercise | MatchExercise | BuildExercise;

export const MAX_PRACTICE_EXERCISES = 14;

export function getLearnUnits(): LearnUnit[] {
  return LEARN_UNITS;
}

export function getAllLearnLessons(): Array<{ unit: LearnUnit; lesson: LearnLesson }> {
  return LEARN_UNITS.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })));
}

export function getLearnLesson(
  lessonId: string
): { unit: LearnUnit; lesson: LearnLesson; index: number } | undefined {
  for (const unit of LEARN_UNITS) {
    const index = unit.lessons.findIndex((l) => l.id === lessonId);
    if (index >= 0) return { unit, lesson: unit.lessons[index], index };
  }
  return undefined;
}

/** Every item in the lesson's unit and kind - the source of wrong answers for quizzes. */
export function getDistractorPool(unit: LearnUnit, kind: LearnKind): LearnItem[] {
  const seen = new Set<string>();
  const out: LearnItem[] = [];
  for (const lesson of unit.lessons) {
    if (lesson.kind !== kind) continue;
    for (const item of lesson.items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        out.push(item);
      }
    }
  }
  return out;
}

const isBengali = (text: string) => /[ঀ-৿]/.test(text);
const t = (text: string): LearnText => ({ text, bn: isBengali(text) });

/** Builds four options (or fewer, if the pool is tiny) around `correct`, never repeating a label. */
function buildOptions(
  correct: LearnText,
  candidates: LearnText[],
  rng: () => number
): { options: LearnText[]; correctIndex: number } {
  const seen = new Set([correct.text]);
  const wrong: LearnText[] = [];
  for (const c of shuffle(candidates, rng)) {
    if (seen.has(c.text)) continue;
    seen.add(c.text);
    wrong.push(c);
    if (wrong.length === 3) break;
  }
  const options = shuffle([correct, ...wrong], rng);
  return { options, correctIndex: options.findIndex((o) => o.text === correct.text) };
}

/** The label shown for an item as a meaning/pronunciation answer, depending on the lesson kind. */
function meaningOf(item: LearnItem, kind: LearnKind): string {
  if (kind === "word") return item.en ?? item.roman;
  return item.roman;
}

function chooseBoth(
  item: LearnItem,
  kind: LearnKind,
  others: LearnItem[],
  rng: () => number
): ChooseExercise[] {
  const out: ChooseExercise[] = [];
  if (kind === "number") {
    const wordOptions = buildOptions(
      t(item.word ?? item.bn),
      others.map((o) => t(o.word ?? o.bn)),
      rng
    );
    out.push({
      type: "choose",
      itemId: item.id,
      question: "whichNumberWord",
      prompt: t(item.bn),
      speak: item.word,
      ...wordOptions
    });
    const numOptions = buildOptions(
      t(item.bn),
      others.map((o) => t(o.bn)),
      rng
    );
    out.push({
      type: "choose",
      itemId: item.id,
      question: "whichNumeral",
      prompt: { text: item.word ?? item.bn, bn: true, sub: item.roman },
      speak: item.word,
      ...numOptions
    });
    return out;
  }

  const meaning = meaningOf(item, kind);
  const toMeaning = buildOptions(
    t(meaning),
    others.map((o) => t(meaningOf(o, kind))),
    rng
  );
  out.push({
    type: "choose",
    itemId: item.id,
    question: kind === "word" ? "whichMeaning" : "whichRoman",
    prompt: t(item.bn),
    speak: item.bn,
    ...toMeaning
  });
  const toGlyph = buildOptions(
    t(item.bn),
    others.map((o) => t(o.bn)),
    rng
  );
  out.push({
    type: "choose",
    itemId: item.id,
    question: kind === "word" ? "whichWord" : "whichLetter",
    prompt: { text: meaning, bn: false, ...(kind === "word" ? { sub: item.roman } : {}) },
    speak: item.bn,
    ...toGlyph
  });
  return out;
}

function makeMatch(items: LearnItem[], kind: LearnKind, rng: () => number): MatchExercise {
  const chosen = shuffle(items, rng).slice(0, 5);
  const pairs = chosen.map((item) => ({
    id: item.id,
    left: t(item.bn),
    right: t(kind === "number" ? (item.word ?? item.bn) : meaningOf(item, kind))
  }));
  // Two different items can share an answer label (rare); drop repeats so every pair is unambiguous.
  const seen = new Set<string>();
  const unique = pairs.filter((p) => (seen.has(p.right.text) ? false : (seen.add(p.right.text), true)));
  return {
    type: "match",
    pairs: unique,
    rightOrder: shuffle(
      unique.map((p) => p.id),
      rng
    )
  };
}

function makeExample(
  item: LearnItem,
  kind: LearnKind,
  others: LearnItem[],
  rng: () => number
): ExampleExercise | null {
  if (!item.example) return null;
  const opts = buildOptions(
    t(item.bn),
    others.map((o) => t(o.bn)),
    rng
  );
  return {
    type: "example",
    itemId: item.id,
    relation: kind === "conjunct" ? "contains" : "starts",
    prompt: { text: item.example.bn, bn: true, sub: item.example.en },
    speak: item.example.bn,
    ...opts
  };
}

function makeBuild(item: LearnItem, rng: () => number): BuildExercise | null {
  const answer = tokenizeToTiles(item.bn);
  if (answer.length < 2 || !item.en) return null;
  let tiles = answer.map((text, id) => ({ id, text }));
  // Reshuffle until the order differs from the answer, so the exercise is never pre-solved.
  for (let i = 0; i < 6; i++) {
    tiles = shuffle(tiles, rng);
    if (tiles.map((x) => x.text).join("|") !== answer.join("|")) break;
  }
  return { type: "build", itemId: item.id, meaning: item.en, target: item.bn, answer, tiles };
}

/**
 * Turns a lesson into a play sequence: introduction cards, then a mix of
 * multiple-choice, matching, "find the letter in a word" and word-building
 * exercises. Deterministic for a given `rng`, so it is testable.
 */
export function generateExercises(
  lesson: LearnLesson,
  pool: LearnItem[],
  rng: () => number
): LearnExercise[] {
  const kind = lesson.kind;
  const items = lesson.review ? shuffle(lesson.items, rng).slice(0, 8) : lesson.items;
  const others = [...lesson.items, ...pool];

  const flash: FlashExercise[] = lesson.review
    ? []
    : items.map((item) => ({ type: "flash", itemId: item.id, item }));

  const practice: LearnExercise[] = [];
  for (const item of items) {
    const both = chooseBoth(
      item,
      kind,
      others.filter((o) => o.id !== item.id),
      rng
    );
    if (lesson.review) practice.push(both[Math.floor(rng() * both.length)]);
    else practice.push(...both);
  }
  if (kind === "letter" || kind === "conjunct") {
    for (const item of shuffle(items, rng).slice(0, 4)) {
      const ex = makeExample(
        item,
        kind,
        others.filter((o) => o.id !== item.id),
        rng
      );
      if (ex) practice.push(ex);
    }
  }
  if (kind === "word") {
    for (const item of shuffle(items, rng).slice(0, 3)) {
      const build = makeBuild(item, rng);
      if (build) practice.push(build);
    }
  }

  const trimmed = shuffle(practice, rng).slice(0, MAX_PRACTICE_EXERCISES);
  const match = makeMatch(items, kind, rng);
  const middle = Math.ceil(trimmed.length / 2);
  return [...flash, ...trimmed.slice(0, middle), match, ...trimmed.slice(middle)];
}
