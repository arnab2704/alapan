"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { AlponaDivider } from "@alapon/ui";
import { hasSeenWelcomeBanner, markWelcomeBannerSeen } from "@/lib/welcomeBanner";

const PILLARS = [
  { key: "language", emoji: "📖" },
  { key: "festivals", emoji: "🪔" },
  { key: "culture", emoji: "🎭" },
  { key: "adda", emoji: "☕" }
] as const;

/**
 * A once-per-visitor welcome popup that roots the whole site in core
 * Bengali culture before anything else loads - shown the first time
 * someone lands on the homepage, dismissed permanently after (localStorage,
 * same pattern as ShobdoShakti's onboarding dialog).
 */
export function WelcomeBanner() {
  const t = useTranslations("welcome");
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    markWelcomeBannerSeen();
    setOpen(false);
  }, []);

  // The Escape listener is attached on mount, before the dialog can render,
  // so a keypress can never land in the gap between "dialog visible" and
  // "listener attached".
  useEffect(() => {
    if (!hasSeenWelcomeBanner()) setOpen(true);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dialogRef.current) close();
    }
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [close]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-banner-title"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-alpona border border-ink-100 bg-gradient-to-b from-marigold-50 via-cream-50 to-cream-50 p-6 text-center shadow-xl focus:outline-none dark:border-ink-700 dark:from-ink-800 dark:via-ink-800 dark:to-ink-800 sm:p-8"
          >
            <p aria-hidden="true" className="text-4xl">
              🙏
            </p>
            <h2
              id="welcome-banner-title"
              className="font-bengaliDisplay mt-3 text-2xl font-bold text-ink-900 dark:text-ink-50 sm:text-3xl"
            >
              {t("heading")}
            </h2>
            <p className="mt-1 font-bengaliDisplay text-sm font-medium text-sindoor-600">{t("tagline")}</p>

            <AlponaDivider className="mx-auto mt-4 h-3 w-32 text-alpona-300 dark:text-ink-600" />

            <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-200">{t("description")}</p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.key}
                  className="flex flex-col items-center gap-1 rounded-lg border border-ink-100 bg-cream-50/80 px-2 py-3 dark:border-ink-700 dark:bg-ink-900/40"
                >
                  <span aria-hidden="true" className="text-xl">
                    {pillar.emoji}
                  </span>
                  <span className="text-xs font-medium text-ink-600 dark:text-ink-200">
                    {t(`pillars.${pillar.key}`)}
                  </span>
                </div>
              ))}
            </div>

            <button type="button" onClick={close} className="btn btn-primary mt-6 w-full sm:w-auto">
              {t("cta")}
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
