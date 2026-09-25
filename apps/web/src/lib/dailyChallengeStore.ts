import type { DailyDifficulty, DailyResultSummary } from "@alapon/game-engine";

const PROGRESS_KEY = "alapon.daily-challenge.v1";
const HISTORY_KEY = "alapon.daily-challenge.history.v1";

export interface DailyProgress {
  date: string;
  roundIndex: number;
  foundByRound: string[][];
  score: number;
  hintsUsed: number;
  finished: boolean;
}

export interface StoredDailyResult extends DailyResultSummary {
  date: string;
  difficulty: DailyDifficulty;
}

export function readDailyProgress(date: string): DailyProgress | null {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<DailyProgress>;
    if (p.date !== date || !Array.isArray(p.foundByRound) || typeof p.roundIndex !== "number") return null;
    return {
      date,
      roundIndex: p.roundIndex,
      foundByRound: p.foundByRound.map((r) =>
        Array.isArray(r) ? r.filter((w): w is string => typeof w === "string") : []
      ),
      score: typeof p.score === "number" ? p.score : 0,
      hintsUsed: typeof p.hintsUsed === "number" ? p.hintsUsed : 0,
      finished: p.finished === true
    };
  } catch {
    return null;
  }
}

export function writeDailyProgress(progress: DailyProgress): void {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable: the game still plays, it just will not resume.
  }
}

export function readDailyHistory(): Record<string, StoredDailyResult> {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, StoredDailyResult>)
      : {};
  } catch {
    return {};
  }
}

export function saveDailyResult(result: StoredDailyResult): void {
  try {
    const history = readDailyHistory();
    const keys = Object.keys(history).sort();
    // Keep about a year of results.
    for (const old of keys.slice(0, Math.max(0, keys.length - 365))) delete history[old];
    history[result.date] = result;
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function readDailyResult(date: string): StoredDailyResult | null {
  return readDailyHistory()[date] ?? null;
}
