"use client";

import { useCallback, useEffect, useState } from "react";
import { recordQuizSetResult } from "@alapon/game-engine";
import type { QuizProgressMap } from "@alapon/game-engine";
import { readQuizLevelProgress, writeQuizLevelProgress } from "@/lib/quizLevelProgress";

export interface UseQuizLevelProgressResult {
  /** False until localStorage has been read on the client - render a skeleton, not "locked", before then. */
  isLoaded: boolean;
  progress: QuizProgressMap;
  record: (level: number, set: number, score: number, total: number) => void;
}

export function useQuizLevelProgress(): UseQuizLevelProgressResult {
  const [progress, setProgress] = useState<QuizProgressMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(readQuizLevelProgress());
    setIsLoaded(true);
  }, []);

  const record = useCallback((level: number, set: number, score: number, total: number) => {
    // Re-read from storage so two open tabs can't overwrite each other's progress.
    const next = recordQuizSetResult(readQuizLevelProgress(), level, set, score, total);
    writeQuizLevelProgress(next);
    setProgress(next);
  }, []);

  return { isLoaded, progress, record };
}
