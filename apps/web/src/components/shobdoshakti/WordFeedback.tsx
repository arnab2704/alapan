"use client";

import { useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import type { MoveError } from "@alapon/game-engine";
import type { GameStatus } from "./gameTypes";

export interface WordFeedbackProps {
  status: GameStatus;
  errors: MoveError[];
  formedWords: string[];
  pointsScored: number | null;
}

/**
 * Inline validation/result message. Never shows technical error text (no
 * error codes, stack traces) - only the translated, human copy from
 * shobdoshakti.errors.* - see spec §28.
 */
export function WordFeedback({ status, errors, formedWords, pointsScored }: WordFeedbackProps) {
  const t = useTranslations("shobdoshakti");
  const tErrors = useTranslations("shobdoshakti.errors");

  if (status === "invalid") {
    const code = errors[0]?.code ?? "no_tiles";
    return (
      <p role="alert" className="rounded-md bg-sindoor-50 px-3 py-2 text-sm text-sindoor-700">
        {tErrors(code)}
      </p>
    );
  }

  if (status === "idle" && formedWords.length > 0 && pointsScored !== null) {
    return (
      <p role="status" className="rounded-md bg-shapla-50 px-3 py-2 text-sm text-shapla-700">
        {t("wordsFormed")}: {formedWords.join(", ")} (+{toBengaliDigits(pointsScored)})
      </p>
    );
  }

  return null;
}
