"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Link } from "@/i18n/navigation";
import { Daily5ShareButton } from "./Daily5ShareButton";

/** The calm "you're done for today" moment. Warm, not gamified; the streak is shown only as a gentle note. */
export function Daily5Complete({ streak }: { streak: number }) {
  const t = useTranslations("daily5");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card-result mt-5"
    >
      <motion.p
        aria-hidden="true"
        initial={reduceMotion ? false : { scale: 0.6, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
        className="text-5xl"
      >
        🪔
      </motion.p>
      <h3 className="display mt-2 text-3xl">{t("completeTitle")}</h3>
      <p className="mt-1 text-lg text-ink-700 dark:text-ink-100">{t("completeSub")}</p>
      {streak > 1 ? (
        <p className="mt-2 text-sm text-ink-500">{t("withBengal", { days: toDigits(streak) })}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Daily5ShareButton />
        <Link href="/discover" className="btn btn-secondary">
          {t("keepExploring")}
        </Link>
      </div>
    </motion.div>
  );
}
