"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getAddaPrompt,
  getDailyWord,
  getHistoryForDate,
  getPersonOfTheDay,
  toBengaliDigits
} from "@alapon/bengali";
import { getDailyLearnMoment, getDailyQuiz } from "@alapon/game-engine";
import { useDaily5 } from "@/components/daily5/useDaily5";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";
import { toLocalIsoDate } from "@/lib/formatDate";
import { recordDiscovery } from "@/lib/passport";
import { wordHref } from "@/lib/wordLinks";

const sectionClass = "scroll-mt-24 border-t border-ink-100 pt-8 dark:border-ink-700";

function useLocaleInfo() {
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  return { locale, bn, toDigits };
}

/** 01 - the word of the day. Revealing its meaning counts as "done": reading it is the point. */
export function TodayWord() {
  const t = useTranslations("todayPage.word");
  const { bn } = useLocaleInfo();
  const today = useToday();
  const daily = useDaily5();
  const [revealed, setRevealed] = useState(false);

  const wordDone = daily.done.includes("word");
  useEffect(() => {
    if (wordDone) setRevealed(true);
  }, [wordDone]);

  if (!today) return <div id="word" className={sectionClass} />;
  const word = getDailyWord(today);

  return (
    <section id="word" aria-labelledby="today-word-heading" className={sectionClass}>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 id="today-word-heading" className="display mt-2 text-5xl sm:text-6xl" lang="bn">
        {word.word}
      </h2>
      <p className="mt-1 text-lg text-ink-500">{word.roman}</p>
      {revealed ? (
        <div className="reading mt-4 max-w-xl">
          <p className="text-xl text-ink-800 dark:text-ink-100">{bn ? word.meaningBn : word.meaningEn}</p>
          <p className="mt-3 text-ink-600 dark:text-ink-200">
            <span className="font-semibold">{t("example")}: </span>
            <span lang="bn">{word.exampleBn}</span>
          </p>
          <p className="mt-3">
            <Link href={wordHref(word.word)} className="btn btn-secondary">
              {t("dna")}
            </Link>
          </p>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => {
            setRevealed(true);
            daily.mark("word");
          }}
        >
          {t("reveal")}
        </button>
      )}
    </section>
  );
}

/** 03 - one quiz question, answered in place. The answer is remembered for the day. */
export function TodayQuestion() {
  const t = useTranslations("todayPage.question");
  const { bn } = useLocaleInfo();
  const today = useToday();
  const daily = useDaily5();
  const [choice, setChoice] = useState<number | null>(null);
  const storageKey = "alapon.today.question.v1";

  useEffect(() => {
    if (!today) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      const saved = raw ? (JSON.parse(raw) as { date?: string; choice?: number }) : null;
      if (saved?.date === toLocalIsoDate(today) && typeof saved.choice === "number") setChoice(saved.choice);
    } catch {
      // ignore unreadable storage
    }
  }, [today]);

  if (!today) return <div id="question" className={sectionClass} />;
  const question = getDailyQuiz(today)[0];
  const answered = choice !== null;

  function pick(index: number) {
    if (answered) return;
    setChoice(index);
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ date: toLocalIsoDate(today as Date), choice: index })
      );
    } catch {
      // storage unavailable
    }
    daily.mark("question");
  }

  return (
    <section id="question" aria-labelledby="today-question-heading" className={sectionClass}>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 id="today-question-heading" className="display mt-2 text-2xl leading-snug sm:text-3xl">
        {bn ? question.questionBn : question.questionEn}
      </h2>
      <div
        role="group"
        aria-labelledby="today-question-heading"
        className="mt-4 grid max-w-xl gap-2 sm:grid-cols-2"
      >
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const state = !answered ? "idle" : isCorrect ? "right" : i === choice ? "wrong" : "muted";
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => pick(i)}
              className={`min-h-12 rounded-alpona border-2 px-4 py-2 text-left text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 ${
                state === "right"
                  ? "border-shapla-500 bg-shapla-50 text-shapla-800 dark:bg-ink-800 dark:text-shapla-200"
                  : state === "wrong"
                    ? "border-sindoor-500 bg-sindoor-50 text-sindoor-800 dark:bg-ink-800 dark:text-sindoor-200"
                    : state === "muted"
                      ? "border-ink-100 text-ink-400 dark:border-ink-700"
                      : "border-ink-200 bg-cream-100 hover:border-sindoor-300 dark:border-ink-600 dark:bg-ink-800"
              }`}
            >
              {bn ? option.textBn : option.textEn}
            </button>
          );
        })}
      </div>
      <div role="status" aria-live="polite" className="mt-3 min-h-6 text-base">
        {answered ? (
          <>
            <p className="font-semibold">
              {choice === question.correctIndex ? t("correct") : t("incorrect")}
            </p>
            {(bn ? question.explanationBn : question.explanationEn) ? (
              <p className="reading text-ink-600 dark:text-ink-200">
                {bn ? question.explanationBn : question.explanationEn}
              </p>
            ) : null}
          </>
        ) : null}
      </div>
      {answered ? (
        <p className="mt-2">
          <Link href="/quiz/daily" className="btn btn-text">
            {t("more")}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

/** 04 - a person and a moment from history; "read" counts the discovery. */
export function TodayDiscovery() {
  const t = useTranslations("todayPage.discover");
  const { bn, toDigits } = useLocaleInfo();
  const today = useToday();
  const daily = useDaily5();

  if (!today) return <div id="discover" className={sectionClass} />;
  const person = getPersonOfTheDay(today);
  const history = getHistoryForDate(today);
  const done = daily.isDone("discover");

  return (
    <section id="discover" aria-labelledby="today-discover-heading" className={sectionClass}>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 id="today-discover-heading" className="display mt-2 text-3xl sm:text-4xl">
        {t("heading")}
      </h2>
      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <article className="card-editorial">
          <h3 className="text-sm font-bold text-sindoor-700 dark:text-sindoor-300">{t("person")}</h3>
          <p className="display mt-1 text-2xl">{bn ? person.nameBn : person.nameEn}</p>
          <p className="text-sm text-ink-500">
            {bn ? person.fieldBn : person.fieldEn} · {bn ? person.lifeBn : person.lifeEn}
          </p>
          <p className="reading mt-2 text-ink-700 dark:text-ink-100">
            {bn ? person.blurbBn : person.blurbEn}
          </p>
        </article>
        <article className="card-editorial">
          <h3 className="text-sm font-bold text-sindoor-700 dark:text-sindoor-300">{t("history")}</h3>
          <p className="display mt-1 text-2xl">{bn ? history.event.titleBn : history.event.titleEn}</p>
          <p className="text-sm text-ink-500">
            {history.daysAway === 0 ? t("today") : t("inDays", { days: toDigits(history.daysAway) })} ·{" "}
            {toDigits(history.event.year)}
          </p>
          <p className="reading mt-2 text-ink-700 dark:text-ink-100">
            {bn ? history.event.detailBn : history.event.detailEn}
          </p>
        </article>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={done}
          onClick={() => {
            recordDiscovery("people", person.slug);
            recordDiscovery("stories", `history-${history.event.slug}`);
            daily.mark("discover");
          }}
          className="btn btn-secondary"
        >
          {done ? `✓ ${t("read")}` : t("markRead")}
        </button>
        <Link href="/discover" className="btn btn-text">
          {t("more")}
        </Link>
      </div>
    </section>
  );
}

/** 05 - one small thing to learn, with a three-option check. */
export function TodayLearn() {
  const t = useTranslations("todayPage.learn");
  const today = useToday();
  const daily = useDaily5();
  const [choice, setChoice] = useState<number | null>(null);

  if (!today) return <div id="learn" className={sectionClass} />;
  const moment = getDailyLearnMoment(today);
  const answered = choice !== null || daily.isDone("learn");

  return (
    <section id="learn" aria-labelledby="today-learn-heading" className={sectionClass}>
      <p className="eyebrow">{t("eyebrow")}</p>
      <div className="mt-2 flex flex-wrap items-center gap-6">
        <h2 id="today-learn-heading" className="display text-7xl" lang="bn">
          {moment.item.bn}
        </h2>
        <div className="max-w-md">
          <p className="text-lg font-semibold">{t("question")}</p>
          <div role="group" aria-label={t("question")} className="mt-3 flex flex-wrap gap-2">
            {moment.options.map((option, i) => {
              const right = i === moment.correctIndex;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => {
                    setChoice(i);
                    daily.mark("learn");
                  }}
                  className={`min-h-12 min-w-16 rounded-full border-2 px-5 text-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 ${
                    answered && right
                      ? "border-shapla-500 bg-shapla-50 text-shapla-800 dark:bg-ink-800 dark:text-shapla-200"
                      : answered && i === choice
                        ? "border-sindoor-500 bg-sindoor-50 text-sindoor-800 dark:bg-ink-800"
                        : "border-ink-200 bg-cream-100 hover:border-sindoor-300 dark:border-ink-600 dark:bg-ink-800"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {answered ? (
        <div role="status" className="reading mt-4 max-w-xl">
          <p className="text-lg">
            <span lang="bn" className="font-bold">
              {moment.item.bn}
            </span>{" "}
            = <strong>{moment.item.roman}</strong>
            {moment.item.hint ? (
              <span className="text-ink-600 dark:text-ink-200"> - {moment.item.hint}</span>
            ) : null}
          </p>
          {moment.item.example ? (
            <p className="text-ink-600 dark:text-ink-200">
              {t("example")}: <span lang="bn">{moment.item.example.bn}</span> ({moment.item.example.en})
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link href={`/learn/${moment.lessonId}`} className="btn btn-secondary">
          {t("goLesson")}
        </Link>
        <Link href="/play/shobdoshakti" className="btn btn-text">
          {t("thenPlay")}
        </Link>
      </div>
    </section>
  );
}

/** Today's Adda: a culture-first conversation starter. */
export function TodayAdda() {
  const t = useTranslations("todayPage.adda");
  const { bn } = useLocaleInfo();
  const today = useToday();
  if (!today) return <div id="adda" className={sectionClass} />;
  const prompt = getAddaPrompt(today);

  return (
    <section id="adda" aria-labelledby="today-adda-heading" className={sectionClass}>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 id="today-adda-heading" className="display reading mt-2 max-w-2xl text-2xl sm:text-3xl">
        {bn ? prompt.bn : prompt.en}
      </h2>
      <p className="mt-4">
        <Link href="/theke-adda?prompt=today" className="btn btn-primary">
          {t("answer")}
        </Link>
      </p>
    </section>
  );
}
