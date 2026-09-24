import { DAILY_QUIZ_SIZE } from "./quiz";

export interface QuizChallenge {
  /** ISO yyyy-mm-dd of the daily quiz being challenged. */
  date: string;
  score: number;
  total: number;
  /** The challenger's display name, or null when they did not share one. */
  name: string | null;
}

export type ChallengeOutcome = "win" | "tie" | "lose";

const EARLIEST_QUIZ_DATE = "2026-01-01";
const NAME_MAX = 24;

/** A spoiler-free Wordle-style row: one square per question, green for right and red for wrong. */
export function shareGrid(results: boolean[]): string {
  return results.map((ok) => (ok ? "🟩" : "🟥")).join("");
}

function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Trims control characters and length; a name that is empty afterwards becomes null. */
export function cleanChallengeName(raw: string | undefined | null): string | null {
  if (!raw) return null;
  // eslint-disable-next-line no-control-regex
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>]/g, "")
    .trim()
    .slice(0, NAME_MAX)
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

export function buildChallengeQuery(challenge: QuizChallenge): string {
  const params = new URLSearchParams({ d: challenge.date, s: String(challenge.score) });
  if (challenge.name) params.set("n", challenge.name);
  return params.toString();
}

/**
 * Validates untrusted link parameters. The date must be a real day from the
 * start of the quiz through tomorrow (a day of slack for timezones), and the
 * score must fit the quiz size - so a tampered link can never show nonsense.
 */
export function parseChallenge(
  params: { d?: string; s?: string; n?: string },
  now: Date
): QuizChallenge | null {
  const { d, s, n } = params;
  if (!d || !isRealDate(d)) return null;
  const latest = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (d < EARLIEST_QUIZ_DATE || d > toIso(latest)) return null;
  if (!s || !/^\d$/.test(s)) return null;
  const score = Number(s);
  if (score > DAILY_QUIZ_SIZE) return null;
  return { date: d, score, total: DAILY_QUIZ_SIZE, name: cleanChallengeName(n) };
}

export function compareToChallenge(mine: number, theirs: number): ChallengeOutcome {
  return mine > theirs ? "win" : mine === theirs ? "tie" : "lose";
}
