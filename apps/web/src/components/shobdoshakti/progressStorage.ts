import type { WordJaalProgressData } from "./wordJaalTypes";

const STORAGE_KEY = "alapon.shobdoshakti.wordjaal-progress.v3";

export function defaultProgress(): WordJaalProgressData {
  return { currentLevel: 1, currentCombinationIndex: 0, highestUnlockedLevel: 1, totalScore: 0 };
}

export function readProgress(): WordJaalProgressData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<WordJaalProgressData>;
    return {
      currentLevel: parsed.currentLevel ?? 1,
      currentCombinationIndex: parsed.currentCombinationIndex ?? 0,
      highestUnlockedLevel: parsed.highestUnlockedLevel ?? 1,
      totalScore: parsed.totalScore ?? 0
    };
  } catch {
    return defaultProgress();
  }
}

export function writeProgress(progress: WordJaalProgressData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing / storage disabled - progress just won't persist across visits.
  }
}

const ONBOARDING_KEY = "alapon.shobdoshakti.onboarding-dismissed.v1";

export function hasSeenOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboardingSeen(): void {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // ignore
  }
}
