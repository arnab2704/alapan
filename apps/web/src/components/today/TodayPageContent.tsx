"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  getDailyWord,
  getHistoryForDate,
  getPersonOfTheDay,
  getUpcomingFestivals,
  toBengaliDigits
} from "@alapon/bengali";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { BengaliDateCard } from "@/components/calendar/BengaliDateCard";
import { FestivalSpotlight } from "@/components/calendar/FestivalSpotlight";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";

const linkClass =
  "inline-flex min-h-11 items-center rounded-full bg-sindoor-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600";

/** The "what is happening in the Bengali world today" page. All content is derived client-side from today's date. */
export function TodayPageContent() {
  const t = useTranslations("today");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();

  const word = today ? getDailyWord(today) : null;
  const person = today ? getPersonOfTheDay(today) : null;
  const history = today ? getHistoryForDate(today) : null;
  const festival = today ? getUpcomingFestivals(today, 1)[0] : undefined;

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("heading")} description={t("description")} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        <BengaliDateCard />
        {today && festival ? <FestivalSpotlight festival={festival} today={today} /> : null}
      </div>

      {today && word && person && history ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="border-t-4 border-t-marigold-400">
            <h2 className="text-sm font-semibold text-marigold-700 dark:text-marigold-300">
              {t("wordTitle")}
            </h2>
            <p className="font-bengaliDisplay mt-2 text-4xl font-extrabold text-ink-900 dark:text-ink-50">
              {word.word}
            </p>
            <p className="text-sm text-ink-500">{word.roman}</p>
            <p className="mt-3 text-ink-700 dark:text-ink-100">{bn ? word.meaningBn : word.meaningEn}</p>
            <p className="mt-3 text-sm text-ink-600 dark:text-ink-200">
              <span className="font-semibold">{t("wordExample")}: </span>
              {word.exampleBn}
            </p>
          </Card>

          <Card className="border-t-4 border-t-sindoor-400">
            <h2 className="text-sm font-semibold text-sindoor-700 dark:text-sindoor-300">
              {t("personTitle")}
            </h2>
            <p className="font-bengaliDisplay mt-2 text-2xl font-extrabold text-ink-900 dark:text-ink-50">
              {bn ? person.nameBn : person.nameEn}
            </p>
            <p className="text-sm text-ink-500">
              {bn ? person.fieldBn : person.fieldEn} · {bn ? person.lifeBn : person.lifeEn}
            </p>
            <p className="mt-3 text-ink-700 dark:text-ink-100">{bn ? person.blurbBn : person.blurbEn}</p>
          </Card>

          <Card className="border-t-4 border-t-shapla-400">
            <h2 className="text-sm font-semibold text-shapla-700 dark:text-shapla-300">
              {t("historyTitle")}
            </h2>
            <p className="font-bengaliDisplay mt-2 text-xl font-bold text-ink-900 dark:text-ink-50">
              {bn ? history.event.titleBn : history.event.titleEn}
            </p>
            <p className="text-sm text-ink-500">
              {history.daysAway === 0
                ? t("historyToday")
                : t("historyIn", { days: toDigits(history.daysAway) })}
              {" · "}
              {t("historyYears", { years: toDigits(history.yearsAgo), year: toDigits(history.event.year) })}
            </p>
            <p className="mt-3 text-ink-700 dark:text-ink-100">
              {bn ? history.event.detailBn : history.event.detailEn}
            </p>
          </Card>

          <Card className="flex flex-col items-start gap-3 border-t-4 border-t-alpona-400">
            <h2 className="text-sm font-semibold text-alpona-700 dark:text-alpona-300">{t("quizTitle")}</h2>
            <Link href="/quiz/daily" className={linkClass}>
              {t("quizCta")}
            </Link>
            <Link href="/puja" className="text-sm font-semibold text-sindoor-600 underline decoration-dotted">
              {t("pujaCta")}
            </Link>
          </Card>
        </div>
      ) : null}
    </Container>
  );
}
