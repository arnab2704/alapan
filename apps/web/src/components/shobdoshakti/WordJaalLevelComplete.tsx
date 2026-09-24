"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { getJourneyStage } from "./journeyStages";

export interface WordJaalLevelCompleteProps {
  reachedLevel: number;
  onContinue: () => void;
}

/** Shown once when a full level (all its combinations) is completed and the player advances to the next level. */
export function WordJaalLevelComplete({ reachedLevel, onContinue }: WordJaalLevelCompleteProps) {
  const t = useTranslations("shobdoshakti.wordJaal");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const stage = getJourneyStage(reachedLevel);
  const stageTitle = locale === "bn" ? stage.titleBn : stage.titleEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-label={t("levelComplete")}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex w-full max-w-sm flex-col items-center gap-2 rounded-lg border border-marigold-300 bg-marigold-50 px-6 py-8 text-center shadow-xl"
      >
        <span aria-hidden="true" className="text-3xl">
          🎉
        </span>
        <p className="font-bengaliDisplay text-xl font-bold text-ink-900">{t("levelComplete")}</p>
        <p className="text-sm font-medium uppercase tracking-wide text-sindoor-600">
          {t("reachedLevel", { n: toBengaliDigits(reachedLevel) })}
        </p>
        <p className="font-bengaliDisplay text-2xl font-bold text-ink-900">{stageTitle}</p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-3 min-h-11 inline-flex items-center justify-center rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white shadow-sm shadow-sindoor-900/20 transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
        >
          {t("continueJourney")}
        </button>
      </motion.div>
    </div>
  );
}
