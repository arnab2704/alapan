import type { QuizProgressMap } from "@alapon/game-engine";

const STORAGE_KEY = "alapon.quiz.levels.v1";

/** Best result per level-quiz set, kept per browser (no accounts in V0.1). */
export function readQuizLevelProgress(): QuizProgressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as QuizProgressMap;
  } catch {
    return {};
  }
}

export function writeQuizLevelProgress(progress: QuizProgressMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing / storage disabled - progress just won't persist across visits.
  }
}
