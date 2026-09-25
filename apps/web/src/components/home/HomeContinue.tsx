"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import {
  countCompletedLessons,
  getAllLearnLessons,
  getLearnLesson,
  getNextLessonId
} from "@alapon/game-engine";
import { Container } from "@alapon/ui";
import { readProgress } from "@/components/shobdoshakti/progressStorage";
import { Link } from "@/i18n/navigation";
import { toLocalIsoDate } from "@/lib/formatDate";
import { readLearnProgress } from "@/lib/learnProgress";
import { readQuizProgress } from "@/lib/quizProgress";

interface Item {
  id: string;
  href: string;
  label: string;
  detail: string;
}

/**
 * "Continue": only what the person has actually started, so it never nags. A brand-new visitor sees
 * gentle "start here" suggestions instead.
 */
export function HomeContinue() {
  const t = useTranslations("homePage.continue");
  const locale = useLocale() as "bn" | "en";
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const isBn = locale === "bn";
    const digits = isBn ? toBengaliDigits : (n: number) => String(n);
    const found: Item[] = [];

    const learn = readLearnProgress();
    if (countCompletedLessons(learn) > 0) {
      const order = getAllLearnLessons().map((l) => l.lesson.id);
      const nextId = getNextLessonId(learn, order);
      const next = nextId ? getLearnLesson(nextId) : undefined;
      if (next) {
        found.push({
          id: "learn",
          href: `/learn/${next.lesson.id}`,
          label: t("learn"),
          detail: isBn ? next.lesson.titleBn : next.lesson.titleEn
        });
      }
    }

    const game = readProgress();
    if (game.totalScore > 0 || game.currentLevel > 1 || game.currentCombinationIndex > 0) {
      found.push({
        id: "levels",
        href: "/play/shobdoshakti",
        label: t("levels"),
        detail: t("levelDetail", { level: digits(game.currentLevel) })
      });
    }

    const quiz = readQuizProgress(toLocalIsoDate(new Date()));
    if (quiz && quiz.answers.some((a) => a !== null) && quiz.currentIndex < quiz.answers.length) {
      found.push({
        id: "quiz",
        href: "/quiz/daily",
        label: t("quiz"),
        detail: t("quizDetail", { done: digits(quiz.currentIndex), total: digits(quiz.answers.length) })
      });
    }

    setItems(found);
  }, [locale, t]);

  if (items === null) return null;

  const suggestions: Item[] = [
    { id: "s-learn", href: "/learn/vowels-1", label: t("startLearn"), detail: t("startLearnDetail") },
    { id: "s-play", href: "/play/shobdoshakti", label: t("startPlay"), detail: t("startPlayDetail") }
  ];
  const shown = items.length > 0 ? items : suggestions;

  return (
    <section aria-labelledby="home-continue-heading" className="py-10 sm:py-12">
      <Container>
        <h2 id="home-continue-heading" className="eyebrow">
          {items.length > 0 ? t("heading") : t("headingNew")}
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex min-h-16 items-center justify-between gap-3 rounded-alpona border border-ink-100 bg-cream-100 px-5 py-3 transition-shadow hover:shadow-md dark:border-ink-700 dark:bg-ink-800"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink-500 dark:text-ink-300">
                    {item.label}
                  </span>
                  <span className="font-bengaliDisplay block text-lg font-bold">{item.detail}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-lg text-sindoor-600 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
