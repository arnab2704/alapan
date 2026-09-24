import { QUIZ_QUESTIONS } from "./data/quiz-questions";
import type { QuizCategory, QuizOption, QuizQuestion } from "./data/quiz-questions";
import { shuffle } from "./tileBag";

export type { QuizCategory, QuizOption, QuizQuestion };

export const DAILY_QUIZ_SIZE = 5;

export function getAllQuizQuestions(): QuizQuestion[] {
  return [...QUIZ_QUESTIONS];
}

export function getQuizQuestionById(id: string): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((question) => question.id === id);
}

/**
 * A simple deterministic PRNG (mulberry32) seeded from an integer, so the
 * same seed always produces the same sequence - unlike `Math.random`,
 * which can't be seeded. Used to give every visitor the same daily quiz on
 * a given date without needing server state.
 */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function daysSinceEpoch(date: Date): number {
  const epochUtc = Date.UTC(2026, 0, 1);
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((dateUtc - epochUtc) / 86_400_000);
}

/** A cheap, deterministic string hash (djb2-ish), for turning a question id into a PRNG seed. */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/**
 * Returns the question with its options reordered (and `correctIndex`
 * remapped to match) by a PRNG seeded from `seed`. Authoring the question
 * bank with the correct option always written first is far less
 * error-prone than hand-scattering it across positions 0-3 by eye - but
 * shipping it that way would let anyone "win" by always picking the first
 * option, which is exactly the integrity bug this function exists to
 * close: the data stays readable, the served order doesn't.
 */
export function withShuffledOptions(question: QuizQuestion, seed: number): QuizQuestion {
  const order = shuffle([0, 1, 2, 3], mulberry32(seed));
  return {
    ...question,
    options: order.map((originalIndex) => question.options[originalIndex]),
    correctIndex: order.indexOf(question.correctIndex)
  };
}

/**
 * The same `size` questions for every visitor on a given calendar day,
 * deterministically shuffled from the full question bank by a PRNG seeded
 * from the date - no server state or database needed for a "daily" quiz,
 * the same principle the শব্দজাল level dataset already relies on (content
 * is content, "daily" is just a deterministic function of the date). Each
 * returned question also has its own options independently (and
 * deterministically) reshuffled - see `withShuffledOptions`. Falls back to
 * the whole (possibly short) bank if `size` exceeds it.
 */
export function getDailyQuiz(date: Date, size: number = DAILY_QUIZ_SIZE): QuizQuestion[] {
  const all = getAllQuizQuestions();
  const daySeed = daysSinceEpoch(date);
  const shuffled = shuffle(all, mulberry32(daySeed));
  const picked = shuffled.slice(0, Math.min(size, shuffled.length));
  return picked.map((question) => withShuffledOptions(question, daySeed ^ hashString(question.id)));
}

export function checkQuizAnswer(question: QuizQuestion, selectedIndex: number): boolean {
  return selectedIndex === question.correctIndex;
}

/** Number of correct answers, matched by question index (answers[i] answers questions[i]). */
export function scoreQuiz(questions: QuizQuestion[], answers: Array<number | null>): number {
  return questions.reduce((score, question, i) => {
    const answer = answers[i];
    return answer !== null && answer !== undefined && checkQuizAnswer(question, answer) ? score + 1 : score;
  }, 0);
}
