export interface LessonRecord {
  /** 1-3 stars from first-try accuracy; 0 means never finished. */
  stars: number;
  bestAccuracy: number;
  completions: number;
}

export interface LearnProgress {
  lessons: Record<string, LessonRecord>;
  xp: number;
  /** ISO date of the last day a lesson was finished. */
  lastDay: string | null;
  streak: number;
}

export const EMPTY_LEARN_PROGRESS: LearnProgress = { lessons: {}, xp: 0, lastDay: null, streak: 0 };

export const XP_PER_CORRECT = 10;
export const XP_LESSON_BONUS = 20;

export function starsForAccuracy(accuracy: number): number {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}

function dayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Streak after finishing a lesson on `today`: same day keeps it, the next day extends it, a gap restarts at 1. */
export function nextStreak(previous: LearnProgress, today: string): number {
  if (!previous.lastDay) return 1;
  const gap = dayNumber(today) - dayNumber(previous.lastDay);
  if (gap <= 0) return Math.max(previous.streak, 1);
  return gap === 1 ? previous.streak + 1 : 1;
}

/** Records a finished lesson. `correctFirstTry` of `total` exercises drives stars and XP; stars never go down. */
export function recordLessonResult(
  previous: LearnProgress,
  lessonId: string,
  correctFirstTry: number,
  total: number,
  today: string
): LearnProgress {
  const accuracy = total > 0 ? correctFirstTry / total : 1;
  const old = previous.lessons[lessonId];
  const record: LessonRecord = {
    stars: Math.max(old?.stars ?? 0, starsForAccuracy(accuracy)),
    bestAccuracy: Math.max(old?.bestAccuracy ?? 0, accuracy),
    completions: (old?.completions ?? 0) + 1
  };
  return {
    lessons: { ...previous.lessons, [lessonId]: record },
    xp: previous.xp + correctFirstTry * XP_PER_CORRECT + XP_LESSON_BONUS,
    lastDay: today,
    streak: nextStreak(previous, today)
  };
}

export function countCompletedLessons(progress: LearnProgress): number {
  return Object.values(progress.lessons).filter((l) => l.stars > 0).length;
}

/** The first lesson (in curriculum order) that has never been finished. */
export function getNextLessonId(progress: LearnProgress, orderedLessonIds: string[]): string | null {
  return orderedLessonIds.find((id) => !(progress.lessons[id]?.stars > 0)) ?? null;
}
