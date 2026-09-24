"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GameMode } from "./wordJaalTypes";

export interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  mode: GameMode;
  /** Onboarding mode adds the step-by-step intro + "start playing" CTA above the rules. */
  showOnboarding?: boolean;
}

const ONBOARDING_STEPS = ["step1", "step2", "step3", "step4"] as const;
const WORDJAAL_RULES = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"] as const;
const FREEPLAY_RULES = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"] as const;

export function HelpDialog({ open, onClose, mode, showOnboarding = false }: HelpDialogProps) {
  const t = useTranslations("help");
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  const ruleKeys = mode === "level" ? WORDJAAL_RULES : FREEPLAY_RULES;
  const ruleNamespace = mode === "level" ? "wordJaalRules" : "rules";

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-dialog-title"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-ink-200 bg-cream-50 p-6 shadow-xl focus:outline-none"
          >
            <h2 id="help-dialog-title" className="font-bengaliDisplay text-xl font-bold text-ink-900">
              {t("title")}
            </h2>

            {showOnboarding ? (
              <ol className="mt-4 flex flex-col gap-2 text-sm text-ink-700">
                {ONBOARDING_STEPS.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sindoor-100 text-xs font-semibold text-sindoor-700">
                      {i + 1}
                    </span>
                    {t(`onboarding.${step}`)}
                  </li>
                ))}
              </ol>
            ) : null}

            <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-ink-500">
              {t("rulesHeading")}
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink-700">
              {ruleKeys.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span aria-hidden="true" className="text-marigold-500">
                    •
                  </span>
                  {t(`${ruleNamespace}.${rule}`)}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 inline-flex items-center justify-center rounded-full bg-sindoor-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
              >
                {showOnboarding ? t("onboarding.start") : t("close")}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
