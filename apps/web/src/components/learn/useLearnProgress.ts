"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_LEARN_PROGRESS, recordLessonResult } from "@alapon/game-engine";
import type { LearnProgress } from "@alapon/game-engine";
import { toLocalIsoDate } from "@/lib/formatDate";
import { readLearnProgress, writeLearnProgress } from "@/lib/learnProgress";

export function useLearnProgress() {
  const [progress, setProgress] = useState<LearnProgress>(EMPTY_LEARN_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(readLearnProgress());
    setReady(true);
  }, []);

  const record = useCallback((lessonId: string, correctFirstTry: number, total: number) => {
    const next = recordLessonResult(
      readLearnProgress(),
      lessonId,
      correctFirstTry,
      total,
      toLocalIsoDate(new Date())
    );
    writeLearnProgress(next);
    setProgress(next);
    return next;
  }, []);

  return { progress, ready, record };
}
