"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getDailyWord, toBengaliDigits } from "@alapon/bengali";
import { getDailyLearnMoment, getDailyQuiz } from "@alapon/game-engine";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";
import { readCompletedDays, participationStreak, todayIso } from "@/lib/daily5";
import type { Daily5Item } from "@/lib/daily5";
import { useDaily5 } from "./useDaily5";
import { ItemIcon } from "./ItemIcon";
import { Daily5Complete } from "./Daily5Complete";

interface Row {
  id: Daily5Item;
  href: string;
  teaser: string;
}

/**
 * "আজকের ৫": five small daily moments and how far along the reader is. Each row links to the place
 * where that moment happens (mostly the Today page). Completion is celebrated, never demanded.
 */
export function Daily5Tracker({ variant = "today" }: { variant?: "home" | "today" }) {
  const t = useTranslations("daily5");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();
  const daily = useDaily5();
  const reduceMotion = useReducedMotion();

  const rows = useMemo<Row[]>(() => {
    if (!today) return [];
    const word = getDailyWord(today);
    const question = getDailyQuiz(today)[0];
    const moment = getDailyLearnMoment(today);
    return [
      { id: "word", href: "/today#word", teaser: word.word },
      { id: "game", href: "/play/shobdoshakti", teaser: "ShobdoShakti" },
      { id: "question", href: "/today#question", teaser: bn ? question.questionBn : question.questionEn },
      { id: "discover", href: "/today#discover", teaser: t("discoverTeaser") },
      { id: "learn", href: "/today#learn", teaser: `${moment.item.bn}  ·  ${moment.item.roman}` }
    ];
  }, [today, bn, t]);

  const streak = useMemo(
    () => (daily.ready ? participationStreak(readCompletedDays(), todayIso()) : 0),
    // Re-read after progress changes so completing the fifth item updates it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [daily.ready, daily.count]
  );

  const firstOpen = daily.done.length < 5 ? rows.find((r) => !daily.isDone(r.id))?.id : undefined;

  return (
    <section id="daily5" aria-labelledby="daily5-heading" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="daily5-heading" className="display mt-1 text-3xl sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("subheading")}</p>
        </div>
        <p
          role="status"
          aria-label={t("progressLabel", { count: toDigits(daily.count), total: toDigits(daily.total) })}
          className="font-bengaliDisplay shrink-0 text-3xl font-extrabold text-sindoor-600 dark:text-sindoor-300"
        >
          {toDigits(daily.count)}
          <span className="text-xl text-ink-400">/{toDigits(daily.total)}</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-label={t("heading")}
        aria-valuemin={0}
        aria-valuemax={daily.total}
        aria-valuenow={daily.count}
        className="mt-4 flex gap-1.5"
      >
        {Array.from({ length: daily.total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < daily.count ? "bg-shapla-500" : "bg-ink-100 dark:bg-ink-700"
            }`}
          />
        ))}
      </div>

      {daily.complete ? (
        <Daily5Complete streak={streak} />
      ) : (
        <ol
          className={
            variant === "home"
              ? "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5"
              : "mt-5 divide-y divide-ink-100 border-y border-ink-100 dark:divide-ink-700 dark:border-ink-700"
          }
        >
          {(rows.length > 0 ? rows : placeholderRows()).map((row, index) => {
            const done = daily.isDone(row.id);
            return (
              <motion.li
                className={variant === "home" ? "h-full" : undefined}
                key={row.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: reduceMotion ? 0 : index * 0.05 }}
              >
                <Link
                  href={row.href}
                  className={`group flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 ${
                    variant === "home"
                      ? "card-editorial min-h-16 p-3 sm:h-full sm:min-h-48 sm:min-w-0 sm:flex-col sm:items-stretch sm:gap-2"
                      : "min-h-16 py-3"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`font-bengaliDisplay flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      done
                        ? "bg-shapla-500 text-white"
                        : row.id === firstOpen
                          ? "bg-sindoor-500 text-white"
                          : "border border-ink-200 text-ink-500 dark:border-ink-600"
                    }`}
                  >
                    {done ? "✓" : toDigits(index + 1).padStart(2, toDigits(0))}
                  </span>
                  <ItemIcon
                    id={row.id}
                    className="h-7 w-7 shrink-0 text-marigold-500 sm:order-last sm:mt-auto sm:self-start"
                  />
                  <span className="min-w-0 flex-1 sm:w-full">
                    <span className="block text-sm font-semibold text-ink-500 dark:text-ink-300">
                      {t(`items.${row.id}.title`)}
                      {done ? (
                        <span className="ml-2 text-shapla-700 dark:text-shapla-300">· {t("done")}</span>
                      ) : null}
                    </span>
                    <span
                      className={`font-bengaliDisplay block truncate text-lg font-bold ${variant === "home" ? "sm:line-clamp-3 sm:whitespace-normal sm:break-words" : ""} ${
                        done ? "text-ink-400 line-through decoration-1" : "text-ink-900 dark:text-ink-50"
                      }`}
                    >
                      {row.teaser || "…"}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-lg text-sindoor-600 transition-transform group-hover:translate-x-1 ${variant === "home" ? "sm:hidden" : ""}`}
                  >
                    →
                  </span>
                  <span className="sr-only">{t(`items.${row.id}.action`)}</span>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      )}

      {variant === "home" ? (
        <p className="mt-3 text-right">
          <Link href="/today" className="btn btn-text btn-sm">
            {t("seeAll")}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

function placeholderRows(): Row[] {
  return (["word", "game", "question", "discover", "learn"] as Daily5Item[]).map((id) => ({
    id,
    href: "/today",
    teaser: ""
  }));
}
