"use client";

import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import {
  countCompletedLessons,
  getAllLearnLessons,
  getLearnUnits,
  getNextLessonId
} from "@alapon/game-engine";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { useLearnProgress } from "./useLearnProgress";

const primary = "btn btn-primary btn-lg";

const CATEGORIES: Array<{ id: string; href: string }> = [
  { id: "alphabet", href: "/learn#unit-vowels" },
  { id: "vocabulary", href: "/learn#unit-words" },
  { id: "everyday", href: "/learn/words-1" },
  { id: "pronunciation", href: "/learn/alphabet" },
  { id: "structure", href: "/learn#unit-conjuncts" },
  { id: "culture", href: "/today#word" }
];

export function LearnHome() {
  const t = useTranslations("learn");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const { progress, ready } = useLearnProgress();

  const units = getLearnUnits();
  const order = getAllLearnLessons().map((l) => l.lesson.id);
  const completed = countCompletedLessons(progress);
  const nextId = getNextLessonId(progress, order) ?? order[0];
  const started = completed > 0;

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("heading")} description={t("description")} />

      <Card className="mb-8 flex flex-col gap-4 border-t-4 border-t-marigold-400 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <dt className="text-xs font-semibold text-ink-500">{t("statLessons")}</dt>
            <dd className="font-bengaliDisplay text-2xl font-extrabold">
              {ready ? toDigits(completed) : "-"}/{toDigits(order.length)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">{t("statXp")}</dt>
            <dd className="font-bengaliDisplay text-2xl font-extrabold text-marigold-700 dark:text-marigold-300">
              {ready ? toDigits(progress.xp) : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">{t("statStreak")}</dt>
            <dd className="font-bengaliDisplay text-2xl font-extrabold text-sindoor-600">
              {ready ? toDigits(progress.streak) : "-"} <span aria-hidden="true">🔥</span>
            </dd>
          </div>
        </dl>
        <Link href={`/learn/${nextId}`} className={primary}>
          {started ? t("continue") : t("start")}
        </Link>
      </Card>

      <nav aria-label={t("categoriesLabel")} className="mb-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={category.href}
                className="card-learning flex min-h-16 flex-col justify-center transition-shadow hover:shadow-md"
              >
                <span className="font-bengaliDisplay text-lg font-bold">
                  {t(`categories.${category.id}.title`)}
                </span>
                <span className="text-xs text-ink-600 dark:text-ink-200">
                  {t(`categories.${category.id}.hint`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-600 dark:text-ink-200">{t("pathHint")}</p>
        <Link
          href="/learn/alphabet"
          className="text-sm font-semibold text-sindoor-600 underline decoration-dotted"
        >
          {t("alphabetLink")}
        </Link>
      </div>

      <ol className="flex flex-col gap-6">
        {units.map((unit, unitIndex) => (
          <li key={unit.id} id={`unit-${unit.id}`} className="scroll-mt-24">
            <Card>
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="font-bengaliDisplay flex h-16 w-16 shrink-0 items-center justify-center rounded-alpona bg-sindoor-50 text-2xl font-extrabold text-sindoor-600 dark:bg-ink-700"
                >
                  {unit.icon}
                </span>
                <div>
                  <h2 className="font-bengaliDisplay text-xl font-bold">
                    {toDigits(unitIndex + 1)}. {bn ? unit.titleBn : unit.titleEn}
                  </h2>
                  <p className="text-sm text-ink-600 dark:text-ink-200">{bn ? unit.descBn : unit.descEn}</p>
                </div>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {unit.lessons.map((lesson) => {
                  const stars = progress.lessons[lesson.id]?.stars ?? 0;
                  const isNext = lesson.id === nextId;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/learn/${lesson.id}`}
                        className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border px-4 py-2 transition-colors hover:border-sindoor-300 hover:bg-sindoor-50 dark:hover:bg-ink-700 ${
                          isNext
                            ? "border-sindoor-400 bg-sindoor-50 dark:bg-ink-700"
                            : "border-ink-100 dark:border-ink-700"
                        }`}
                      >
                        <span className="font-bengaliDisplay font-semibold">
                          {bn ? lesson.titleBn : lesson.titleEn}
                          {lesson.review ? (
                            <span className="ml-2 text-xs text-ink-500">· {t("review")}</span>
                          ) : null}
                        </span>
                        <span
                          aria-label={t("starsLabel", { stars: toDigits(stars) })}
                          className="shrink-0 text-sm"
                        >
                          {stars > 0 ? "⭐".repeat(stars) : isNext ? t("startHere") : ""}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </li>
        ))}
      </ol>
    </Container>
  );
}
