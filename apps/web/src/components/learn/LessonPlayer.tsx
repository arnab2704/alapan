"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { hasWordEntry, toBengaliDigits } from "@alapon/bengali";
import { Card, Container } from "@alapon/ui";
import {
  generateExercises,
  getAllLearnLessons,
  getDistractorPool,
  getLearnLesson,
  mulberry32,
  starsForAccuracy,
  XP_LESSON_BONUS,
  XP_PER_CORRECT
} from "@alapon/game-engine";
import type {
  BuildExercise,
  ChooseExercise,
  ExampleExercise,
  FlashExercise,
  LearnExercise,
  LearnText,
  MatchExercise
} from "@alapon/game-engine";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { recordDiscovery } from "@/lib/passport";
import { wordHref } from "@/lib/wordLinks";
import { useLearnProgress } from "./useLearnProgress";
import { useSpeech } from "./useSpeech";

const primary = "btn btn-primary btn-lg";
const secondary = "btn btn-secondary btn-lg";
const optionBase =
  "min-h-14 rounded-alpona border-2 px-4 py-3 text-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-500";

interface QueueItem {
  exercise: LearnExercise;
  /** Retries after a mistake are practice only and are not scored. */
  retry: boolean;
}

interface Feedback {
  correct: boolean;
  answer?: string;
}

/** Big display text shrinks with the word's length so long words never run off a narrow screen. */
function displaySize(text: string, largest: "text-8xl" | "text-6xl") {
  const n = Array.from(text).length;
  if (largest === "text-8xl") {
    return n <= 2 ? "text-8xl" : n <= 4 ? "text-6xl" : n <= 7 ? "text-5xl" : "text-4xl";
  }
  return n <= 4 ? "text-6xl" : n <= 7 ? "text-5xl" : "text-4xl";
}

function textClass(t: LearnText) {
  return t.bn ? "font-bengaliDisplay" : "font-latin";
}

function SpeakButton({ text, label }: { text?: string; label: string }) {
  const { available, speak } = useSpeech();
  if (!text || !available) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-xl hover:bg-sindoor-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:hover:bg-ink-700"
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}

function Flash({ exercise, onNext }: { exercise: FlashExercise; onNext: () => void }) {
  const t = useTranslations("learn");
  const { item } = exercise;
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-sm font-semibold text-sindoor-600">{t("newItem")}</p>
      <p
        className={`font-bengaliDisplay ${displaySize(item.bn, "text-8xl")} max-w-full break-words font-extrabold text-ink-900 dark:text-ink-50`}
        lang="bn"
      >
        {item.bn}
      </p>
      {item.word ? (
        <p className="font-bengaliDisplay text-3xl font-bold" lang="bn">
          {item.word}
        </p>
      ) : null}
      <p className="text-2xl font-semibold text-sindoor-600">
        {item.roman}
        {item.en ? <span className="ml-2 text-ink-600 dark:text-ink-200">· {item.en}</span> : null}
      </p>
      <SpeakButton text={item.word ?? item.bn} label={t("listen")} />
      {item.hint ? <p className="max-w-sm text-sm text-ink-600 dark:text-ink-200">{item.hint}</p> : null}
      {item.example ? (
        <div className="rounded-alpona bg-marigold-50 px-5 py-3 dark:bg-ink-800">
          <p className="text-xs font-semibold text-marigold-700 dark:text-marigold-300">{t("example")}</p>
          <p className="font-bengaliDisplay text-2xl font-bold" lang="bn">
            {item.example.bn}
          </p>
          <p className="text-sm text-ink-600 dark:text-ink-200">
            {item.example.roman} · {item.example.en}
          </p>
        </div>
      ) : null}
      <button type="button" onClick={onNext} className={`${primary} mt-2`}>
        {t("gotIt")}
      </button>
    </div>
  );
}

function Options({
  options,
  disabled,
  chosen,
  correctIndex,
  onChoose
}: {
  options: LearnText[];
  disabled: boolean;
  chosen: number | null;
  correctIndex: number;
  onChoose: (i: number) => void;
}) {
  return (
    <div role="group" className="grid w-full max-w-md grid-cols-2 gap-3">
      {options.map((option, i) => {
        const showCorrect = disabled && i === correctIndex;
        const showWrong = disabled && chosen === i && i !== correctIndex;
        return (
          <button
            key={`${option.text}-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => onChoose(i)}
            lang={option.bn ? "bn" : undefined}
            className={`${optionBase} ${textClass(option)} ${
              showCorrect
                ? "border-shapla-500 bg-shapla-50 text-shapla-800 dark:bg-ink-800 dark:text-shapla-200"
                : showWrong
                  ? "border-sindoor-500 bg-sindoor-50 text-sindoor-800 dark:bg-ink-800 dark:text-sindoor-200"
                  : "border-ink-200 bg-cream-100 text-ink-900 hover:border-sindoor-300 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50"
            }`}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
}

function Choose({
  exercise,
  onAnswer,
  feedback
}: {
  exercise: ChooseExercise | ExampleExercise;
  onAnswer: (correct: boolean, answer: string) => void;
  feedback: Feedback | null;
}) {
  const t = useTranslations("learn");
  const [chosen, setChosen] = useState<number | null>(null);
  const question =
    exercise.type === "choose"
      ? t(`q.${exercise.question}`)
      : t(`q.${exercise.relation === "starts" ? "startsWith" : "contains"}`);
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-base font-semibold text-ink-700 dark:text-ink-100">{question}</p>
      <div className="flex items-center gap-3">
        <p
          className={`${textClass(exercise.prompt)} ${displaySize(exercise.prompt.text, "text-6xl")} max-w-full break-words font-extrabold text-ink-900 dark:text-ink-50`}
          lang={exercise.prompt.bn ? "bn" : undefined}
        >
          {exercise.prompt.text}
        </p>
        <SpeakButton text={exercise.speak} label={t("listen")} />
      </div>
      {exercise.prompt.sub ? <p className="text-lg text-ink-500">{exercise.prompt.sub}</p> : null}
      <Options
        options={exercise.options}
        disabled={feedback !== null}
        chosen={chosen}
        correctIndex={exercise.correctIndex}
        onChoose={(i) => {
          setChosen(i);
          onAnswer(i === exercise.correctIndex, exercise.options[exercise.correctIndex].text);
        }}
      />
    </div>
  );
}

function Match({
  exercise,
  onAnswer,
  feedback
}: {
  exercise: MatchExercise;
  onAnswer: (correct: boolean, answer: string) => void;
  feedback: Feedback | null;
}) {
  const t = useTranslations("learn");
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const mistakes = useRef(0);

  function pickRight(id: string) {
    if (!left || matched.includes(id)) return;
    if (left === id) {
      const next = [...matched, id];
      setMatched(next);
      setLeft(null);
      setWrongPair(null);
      if (next.length === exercise.pairs.length) onAnswer(mistakes.current === 0, "");
    } else {
      mistakes.current += 1;
      setWrongPair(id);
      setLeft(null);
    }
  }

  const byId = new Map(exercise.pairs.map((p) => [p.id, p]));
  const cell = (state: "matched" | "selected" | "wrong" | "idle") =>
    `${optionBase} w-full ${
      state === "matched"
        ? "border-shapla-500 bg-shapla-50 text-shapla-800 opacity-70 dark:bg-ink-800 dark:text-shapla-200"
        : state === "selected"
          ? "border-sindoor-500 bg-sindoor-50 text-ink-900 dark:bg-ink-700 dark:text-ink-50"
          : state === "wrong"
            ? "border-sindoor-500 bg-cream-100 text-ink-900 dark:bg-ink-800 dark:text-ink-50"
            : "border-ink-200 bg-cream-100 text-ink-900 hover:border-sindoor-300 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50"
    }`;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-base font-semibold text-ink-700 dark:text-ink-100">{t("q.match")}</p>
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {exercise.pairs.map((p) => (
            <button
              key={p.id}
              type="button"
              data-pair-id={p.id}
              data-side="left"
              disabled={matched.includes(p.id) || feedback !== null}
              aria-pressed={left === p.id}
              onClick={() => {
                setLeft(p.id);
                setWrongPair(null);
              }}
              lang={p.left.bn ? "bn" : undefined}
              className={`${cell(matched.includes(p.id) ? "matched" : left === p.id ? "selected" : "idle")} ${textClass(p.left)}`}
            >
              {p.left.text}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {exercise.rightOrder.map((id) => {
            const p = byId.get(id)!;
            return (
              <button
                key={id}
                type="button"
                data-pair-id={id}
                data-side="right"
                disabled={matched.includes(id) || feedback !== null || !left}
                onClick={() => pickRight(id)}
                lang={p.right.bn ? "bn" : undefined}
                className={`${cell(matched.includes(id) ? "matched" : wrongPair === id ? "wrong" : "idle")} ${textClass(p.right)}`}
              >
                {p.right.text}
              </button>
            );
          })}
        </div>
      </div>
      <p role="status" className="min-h-6 text-sm text-sindoor-700 dark:text-sindoor-300">
        {wrongPair ? t("tryAgainPair") : ""}
      </p>
    </div>
  );
}

function Build({
  exercise,
  onAnswer,
  feedback
}: {
  exercise: BuildExercise;
  onAnswer: (correct: boolean, answer: string) => void;
  feedback: Feedback | null;
}) {
  const t = useTranslations("learn");
  const [picked, setPicked] = useState<number[]>([]);
  const usedHint = useRef(false);
  const tileById = new Map(exercise.tiles.map((x) => [x.id, x]));
  const remaining = exercise.tiles.filter((x) => !picked.includes(x.id));
  const built = picked.map((id) => tileById.get(id)!.text);
  const complete = picked.length === exercise.answer.length;

  function hint() {
    usedHint.current = true;
    // Rebuild the correct prefix, then place the next tile that continues it.
    let prefix = 0;
    while (prefix < built.length && built[prefix] === exercise.answer[prefix]) prefix++;
    const keep = picked.slice(0, prefix);
    const need = exercise.answer[prefix];
    const candidate = exercise.tiles.find((x) => !keep.includes(x.id) && x.text === need);
    if (candidate) setPicked([...keep, candidate.id]);
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-base font-semibold text-ink-700 dark:text-ink-100">{t("q.build")}</p>
      <p className="text-4xl font-extrabold text-ink-900 dark:text-ink-50">{exercise.meaning}</p>
      <div
        aria-label={t("yourWord")}
        className="flex min-h-20 w-full max-w-md flex-wrap items-center justify-center gap-2 rounded-alpona border-2 border-dashed border-ink-300 p-3 dark:border-ink-600"
      >
        {picked.map((id) => (
          <button
            key={id}
            type="button"
            disabled={feedback !== null}
            onClick={() => setPicked(picked.filter((p) => p !== id))}
            lang="bn"
            className={`${optionBase} font-bengaliDisplay min-w-14 border-sindoor-400 bg-sindoor-50 text-3xl text-ink-900 dark:bg-ink-700 dark:text-ink-50`}
          >
            {tileById.get(id)!.text}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label={t("tiles")}
        className="flex max-w-md flex-wrap items-center justify-center gap-2"
      >
        {remaining.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={feedback !== null}
            onClick={() => setPicked([...picked, tile.id])}
            lang="bn"
            className={`${optionBase} font-bengaliDisplay min-w-14 border-ink-200 bg-cream-100 text-3xl text-ink-900 hover:border-sindoor-300 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50`}
          >
            {tile.text}
          </button>
        ))}
      </div>
      {feedback === null ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={hint} className={secondary}>
            {t("hint")}
          </button>
          <button
            type="button"
            disabled={!complete}
            onClick={() => onAnswer(built.join("") === exercise.target && !usedHint.current, exercise.target)}
            className={primary}
          >
            {t("check")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Complete({
  lessonId,
  correct,
  total,
  xpGained,
  streak,
  onRestart
}: {
  lessonId: string;
  correct: number;
  total: number;
  xpGained: number;
  streak: number;
  onRestart: () => void;
}) {
  const t = useTranslations("learn");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const accuracy = total > 0 ? correct / total : 1;
  const stars = starsForAccuracy(accuracy);
  const all = getAllLearnLessons();
  const idx = all.findIndex((l) => l.lesson.id === lessonId);
  const next = all[idx + 1];
  const lessonWords = (
    getLearnLesson(lessonId)?.lesson.kind === "word" ? getLearnLesson(lessonId)!.lesson.items : []
  )
    .map((item) => item.bn)
    .filter((word) => hasWordEntry(word));
  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-3 py-10 text-center">
      <p aria-hidden="true" className="text-5xl">
        {"⭐".repeat(stars)}
        <span className="opacity-25">{"⭐".repeat(3 - stars)}</span>
      </p>
      <h2 className="font-bengaliDisplay text-2xl font-extrabold">{t("lessonComplete")}</h2>
      <p className="text-ink-700 dark:text-ink-100">
        {t("accuracy", { correct: toDigits(correct), total: toDigits(total) })}
      </p>
      <p className="font-semibold text-marigold-700 dark:text-marigold-300">
        {t("xpGained", { xp: toDigits(xpGained) })}
      </p>
      {streak > 1 ? (
        <p className="text-sm text-sindoor-600">{t("streakDays", { days: toDigits(streak) })}</p>
      ) : null}
      {lessonWords.length > 0 ? (
        <div className="mt-2 w-full">
          <p className="eyebrow">{t("lessonWords")}</p>
          <ul className="mt-2 flex flex-wrap justify-center gap-2">
            {lessonWords.map((word) => (
              <li key={word}>
                <Link
                  href={wordHref(word)}
                  lang="bn"
                  className="font-bengaliDisplay inline-flex min-h-11 items-center rounded-full border border-ink-200 bg-cream-100 px-4 text-lg font-bold hover:border-sindoor-300 dark:border-ink-600 dark:bg-ink-800"
                >
                  {word}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="card-learning mt-3 w-full text-center">
        <p className="font-semibold">{t("playPrompt")}</p>
        <Link href="/play/shobdoshakti" className="btn btn-gold mt-3">
          {t("playNow")}
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        {next ? (
          <Link href={`/learn/${next.lesson.id}`} className={primary}>
            {t("nextLesson")}
          </Link>
        ) : null}
        <button type="button" onClick={onRestart} className={secondary}>
          {t("practiceAgain")}
        </button>
        <Link href="/learn" className={secondary}>
          {t("backToPath")}
        </Link>
      </div>
    </Card>
  );
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const t = useTranslations("learn");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const found = useMemo(() => getLearnLesson(lessonId), [lessonId]);
  const { record } = useLearnProgress();

  // Exercises are shuffled with a time-based seed, so they are built after mount to avoid a server/client mismatch.
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [scoredTotal, setScoredTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctFirst, setCorrectFirst] = useState(0);
  const [streak, setStreak] = useState(0);
  const saved = useRef(false);

  const build = useCallback(() => {
    if (!found) return;
    const pool = getDistractorPool(found.unit, found.lesson.kind);
    const exercises = generateExercises(found.lesson, pool, mulberry32((Date.now() ^ 0x9e3779b9) >>> 0));
    setQueue(exercises.map((exercise) => ({ exercise, retry: false })));
    setScoredTotal(exercises.filter((e) => e.type !== "flash").length);
    setIndex(0);
    setFeedback(null);
    setCorrectFirst(0);
    saved.current = false;
  }, [found]);

  useEffect(() => {
    build();
  }, [build]);

  const done = queue !== null && index >= queue.length;

  useEffect(() => {
    if (!done || saved.current) return;
    saved.current = true;
    setStreak(record(lessonId, correctFirst, scoredTotal).streak);
    recordDiscovery("lessons", lessonId);
    track("lesson_completed", { lessonId });
  }, [done, record, lessonId, correctFirst, scoredTotal]);

  if (!found) {
    return (
      <Container className="py-14">
        <p role="alert">{t("lessonMissing")}</p>
        <Link href="/learn" className="mt-3 inline-block font-semibold text-sindoor-600 underline">
          {t("backToPath")}
        </Link>
      </Container>
    );
  }

  const current = queue?.[index];

  function advance() {
    setFeedback(null);
    setIndex((i) => i + 1);
  }

  function answer(correct: boolean, correctAnswer: string) {
    if (!current) return;
    setFeedback({ correct, answer: correctAnswer });
    if (correct && !current.retry) setCorrectFirst((c) => c + 1);
    if (!correct && !current.retry && current.exercise.type !== "match") {
      setQueue((q) => (q ? [...q, { exercise: current.exercise, retry: true }] : q));
    }
  }

  const total = queue?.length ?? 0;
  const progressPct = total > 0 ? Math.round((Math.min(index, total) / total) * 100) : 0;
  const title = locale === "bn" ? found.lesson.titleBn : found.lesson.titleEn;

  return (
    <Container className="max-w-xl py-8 sm:py-12">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/learn" aria-label={t("backToPath")} className="text-2xl text-ink-500 hover:text-ink-900">
          ✕
        </Link>
        <div
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          className="h-3 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700"
        >
          <div
            className="h-full rounded-full bg-shapla-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      <h1 className="font-bengaliDisplay mb-6 text-center text-lg font-bold text-ink-600 dark:text-ink-200">
        {title}
      </h1>

      {queue === null ? (
        <div className="h-64 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700" aria-hidden="true" />
      ) : done ? (
        <Complete
          lessonId={lessonId}
          correct={correctFirst}
          total={scoredTotal}
          xpGained={correctFirst * XP_PER_CORRECT + XP_LESSON_BONUS}
          streak={streak}
          onRestart={build}
        />
      ) : current ? (
        <div key={index}>
          {current.exercise.type === "flash" ? (
            <Flash exercise={current.exercise} onNext={advance} />
          ) : current.exercise.type === "match" ? (
            <Match exercise={current.exercise} onAnswer={answer} feedback={feedback} />
          ) : current.exercise.type === "build" ? (
            <Build exercise={current.exercise} onAnswer={answer} feedback={feedback} />
          ) : (
            <Choose exercise={current.exercise} onAnswer={answer} feedback={feedback} />
          )}

          <div role="status" aria-live="polite" className="mt-6 min-h-24">
            {feedback ? (
              <div
                className={`flex flex-col items-center gap-3 rounded-alpona p-4 text-center ${
                  feedback.correct
                    ? "bg-shapla-50 text-shapla-800 dark:bg-ink-800 dark:text-shapla-200"
                    : "bg-sindoor-50 text-sindoor-800 dark:bg-ink-800 dark:text-sindoor-200"
                }`}
              >
                <p className="text-lg font-bold">
                  {current.exercise.type === "match"
                    ? t("matchDone")
                    : feedback.correct
                      ? t("correct")
                      : t("incorrect")}
                  {!feedback.correct && feedback.answer ? (
                    <span className="font-bengaliDisplay ml-2">
                      {t("correctAnswer", { answer: feedback.answer })}
                    </span>
                  ) : null}
                </p>
                <button type="button" onClick={advance} className={primary}>
                  {t("continue")}
                </button>
              </div>
            ) : null}
          </div>
          <p className="mt-2 text-center text-xs text-ink-400">
            {toDigits(Math.min(index + 1, total))} / {toDigits(total)}
          </p>
        </div>
      ) : null}
    </Container>
  );
}
