"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { countCompletedLessons, getAllLearnLessons, participationStreak } from "@alapon/game-engine";
import { Container } from "@alapon/ui";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDaily5 } from "@/components/daily5/useDaily5";
import { usePassport } from "@/components/passport/usePassport";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { readDailyHistory, type StoredDailyResult } from "@/lib/dailyChallengeStore";
import { readCompletedDays, todayIso } from "@/lib/daily5";
import { formatGregorianDate } from "@/lib/formatDate";
import { readLearnProgress } from "@/lib/learnProgress";
import { PASSPORT_CATEGORIES } from "@/lib/passport";
import { SAVED_WORDS_EVENT, readSavedWords, unsaveWord, type SavedWord } from "@/lib/savedWords";
import { wordHref } from "@/lib/wordLinks";

/** "আমার আলাপন": one personal page - passport, today, saved words, games, learning, history. */
export function ProfilePage() {
  const t = useTranslations("profile");
  const tp = useTranslations("passport");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const { user, profile, enabled } = useAuth();
  const daily = useDaily5();
  const { data, total } = usePassport();

  const [saved, setSaved] = useState<SavedWord[]>([]);
  const [results, setResults] = useState<StoredDailyResult[]>([]);
  const [lessonsDone, setLessonsDone] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  useEffect(() => {
    track("profile_opened");
    const sync = () => setSaved(readSavedWords().reverse());
    sync();
    window.addEventListener(SAVED_WORDS_EVENT, sync);
    const history = Object.values(readDailyHistory()).sort((a, b) => b.date.localeCompare(a.date));
    setResults(history);
    const learn = readLearnProgress();
    setLessonsDone(countCompletedLessons(learn));
    setXp(learn.xp);
    const days = readCompletedDays();
    setCompletedDays(days);
    setStreak(participationStreak(days, todayIso()));
    return () => window.removeEventListener(SAVED_WORDS_EVENT, sync);
  }, []);

  const name = profile?.display_name ?? user?.email?.split("@")[0] ?? null;
  const best = results.reduce((m, r) => Math.max(m, r.score), 0);
  const totalLessons = getAllLearnLessons().length;

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="display mt-1 text-4xl sm:text-5xl">{t("heading")}</h1>
      <p className="mt-2 text-lg text-ink-700 dark:text-ink-100">
        {name ? t("hello", { name }) : t("guest")}
      </p>
      {!user && enabled ? (
        <p className="mt-1 text-sm text-ink-500">
          <Link href="/login" className="btn btn-text btn-sm">
            {t("signInPrompt")}
          </Link>
        </p>
      ) : null}

      <section aria-labelledby="profile-passport" className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 id="profile-passport" className="display text-2xl">
            {tp("heading")}
          </h2>
          <Link href="/passport" className="btn btn-text btn-sm">
            {t("openPassport")}
          </Link>
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {PASSPORT_CATEGORIES.filter((c) => c !== "lessons").map((category) => (
            <li
              key={category}
              className="rounded-alpona border border-ink-100 bg-cream-100 p-3 text-center dark:border-ink-700 dark:bg-ink-800"
            >
              <p className="font-bengaliDisplay text-2xl font-extrabold text-sindoor-600 dark:text-sindoor-300">
                {toDigits(data[category].length)}
              </p>
              <p className="text-xs font-semibold text-ink-500">{tp(`categories.${category}`)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-ink-500">{t("totalDiscoveries", { count: toDigits(total) })}</p>
      </section>

      <section
        aria-labelledby="profile-today"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="profile-today" className="display text-2xl">
          {t("today")}
        </h2>
        <p className="mt-2 text-lg">
          {t("dailyProgress", { count: toDigits(daily.count), total: toDigits(daily.total) })}{" "}
          <Link href="/today" className="btn btn-text btn-sm">
            {t("goToday")}
          </Link>
        </p>
        {streak > 1 ? (
          <p className="text-sm text-ink-500">{t("withBengal", { days: toDigits(streak) })}</p>
        ) : null}
      </section>

      <section
        aria-labelledby="profile-words"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="profile-words" className="display text-2xl">
          {t("savedWords")}
        </h2>
        {saved.length === 0 ? (
          <p className="mt-2 text-ink-500">{t("noSavedWords")}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {saved.map((item) => (
              <li
                key={item.word}
                className="flex items-center rounded-full border border-ink-200 bg-cream-100 dark:border-ink-600 dark:bg-ink-800"
              >
                <Link
                  href={wordHref(item.word)}
                  lang="bn"
                  className="font-bengaliDisplay min-h-11 px-4 text-lg font-bold leading-[2.75rem]"
                >
                  {item.word}
                </Link>
                <button
                  type="button"
                  onClick={() => unsaveWord(item.word)}
                  aria-label={t("removeWord", { word: item.word })}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-ink-400 hover:text-sindoor-600"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="profile-games"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="profile-games" className="display text-2xl">
          {t("games")}
        </h2>
        <p className="mt-2 text-ink-700 dark:text-ink-100">
          {t("gamesSummary", { count: toDigits(results.length), best: toDigits(best) })}
        </p>
        {results.length > 0 ? (
          <ul className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
            {results.slice(0, 5).map((r) => (
              <li key={r.date}>
                <div className="flex min-h-12 items-center justify-between gap-3 py-2">
                  <span>{formatGregorianDate(r.date, locale, toDigits)}</span>
                  <span className="font-bengaliDisplay font-bold">
                    {t("points", { score: toDigits(r.score) })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section
        aria-labelledby="profile-learning"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="profile-learning" className="display text-2xl">
          {t("learning")}
        </h2>
        <p className="mt-2 text-ink-700 dark:text-ink-100">
          {t("learningSummary", {
            done: toDigits(lessonsDone),
            total: toDigits(totalLessons),
            xp: toDigits(xp)
          })}
        </p>
        <p className="mt-2">
          <Link href="/learn" className="btn btn-secondary">
            {t("continueLearning")}
          </Link>
        </p>
      </section>

      {completedDays.length > 0 ? (
        <section
          aria-labelledby="profile-history"
          className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
        >
          <h2 id="profile-history" className="display text-2xl">
            {t("history")}
          </h2>
          <p className="mt-2 text-ink-700 dark:text-ink-100">
            {t("historySummary", { count: toDigits(completedDays.length) })}
          </p>
        </section>
      ) : null}

      <nav
        aria-label={t("more")}
        className="mt-10 flex flex-wrap gap-x-6 border-t border-ink-100 pt-6 dark:border-ink-700"
      >
        <Link href="/settings" className="btn btn-text">
          {t("settings")}
        </Link>
        {user ? (
          <Link href="/account" className="btn btn-text">
            {t("account")}
          </Link>
        ) : null}
      </nav>
    </Container>
  );
}
