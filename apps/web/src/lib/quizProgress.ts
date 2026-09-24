const STORAGE_KEY = "alapon.quiz.progress.v1";

export interface QuizProgressData {
  /** ISO yyyy-mm-dd - the day this progress belongs to. A stored record for any other date is stale. */
  date: string;
  answers: Array<number | null>;
  currentIndex: number;
}

/** Reads today's quiz progress, or null if nothing is stored, storage is disabled, or the stored record is for a different day (than `todayIso`). */
export function readQuizProgress(todayIso: string): QuizProgressData | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuizProgressData>;
    if (parsed.date !== todayIso || !Array.isArray(parsed.answers)) return null;
    return { date: parsed.date, answers: parsed.answers, currentIndex: parsed.currentIndex ?? 0 };
  } catch {
    return null;
  }
}

export function writeQuizProgress(progress: QuizProgressData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing / storage disabled - progress just won't persist across visits.
  }
}
