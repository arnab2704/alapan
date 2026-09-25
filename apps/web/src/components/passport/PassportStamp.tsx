"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { nextMilestone, type PassportCategory } from "@/lib/passport";

const ICON: Record<PassportCategory, string> = {
  words: "📖",
  places: "📍",
  people: "🧑",
  festivals: "🪔",
  stories: "📜",
  games: "🎲",
  lessons: "✏️"
};

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** One passport category: a progress ring towards the next stamp, the count and its label. */
export function PassportStamp({ category, count }: { category: PassportCategory; count: number }) {
  const t = useTranslations("passport");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const reduce = useReducedMotion();
  const next = nextMilestone(count);
  const previous = [0, 1, 10, 25, 50, 100].filter((m) => m <= count).pop() ?? 0;
  const progress = next === null ? 1 : (count - previous) / (next - previous);

  return (
    <li className="flex flex-col items-center rounded-alpona border border-ink-100 bg-cream-100 p-4 text-center dark:border-ink-700 dark:bg-ink-800">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90" aria-hidden="true">
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            className="stroke-ink-100 dark:stroke-ink-700"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={next === null ? "stroke-marigold-400" : "stroke-sindoor-500"}
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: reduce ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
            transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span aria-hidden="true" className="text-lg leading-none">
            {ICON[category]}
          </span>
          <span className="font-bengaliDisplay text-2xl font-extrabold leading-tight">{toDigits(count)}</span>
        </span>
      </div>
      <p className="font-bengaliDisplay mt-2 text-lg font-bold">{t(`categories.${category}`)}</p>
      <p className="text-xs text-ink-500">
        {next === null
          ? t("allStamps")
          : t("toNext", { count: toDigits(next - count), next: toDigits(next) })}
      </p>
    </li>
  );
}
