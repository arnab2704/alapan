import { EMPTY_LEARN_PROGRESS } from "@alapon/game-engine";
import type { LearnProgress } from "@alapon/game-engine";

const KEY = "alapon.learn.progress.v1";

export function readLearnProgress(): LearnProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_LEARN_PROGRESS;
    const p = JSON.parse(raw) as Partial<LearnProgress>;
    if (typeof p.lessons !== "object" || p.lessons === null) return EMPTY_LEARN_PROGRESS;
    return {
      lessons: p.lessons,
      xp: typeof p.xp === "number" ? p.xp : 0,
      lastDay: typeof p.lastDay === "string" ? p.lastDay : null,
      streak: typeof p.streak === "number" ? p.streak : 0
    };
  } catch {
    return EMPTY_LEARN_PROGRESS;
  }
}

export function writeLearnProgress(progress: LearnProgress): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage disabled: progress lasts for this visit only.
  }
}
