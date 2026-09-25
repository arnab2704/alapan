"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  daysUntil,
  formatBengaliDate,
  getUpcomingFestivals,
  gregorianToBengali,
  toBengaliDigits
} from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { useToday } from "@/components/calendar/useToday";
import { Daily5Tracker } from "@/components/daily5/Daily5Tracker";
import { Link } from "@/i18n/navigation";
import { formatGregorianDate, toLocalIsoDate } from "@/lib/formatDate";
import { LeafSprig } from "@/components/brand/LeafSprig";
import { track } from "@/lib/analytics";
import { TodayAdda, TodayDiscovery, TodayLearn, TodayQuestion, TodayWord } from "./TodaySections";

/**
 * The primary entry point: today's date and festival, then the Daily 5, then each of the five moments
 * in an editorial rhythm (sections and whitespace, not a wall of boxes).
 */
export function TodayPageContent() {
  const t = useTranslations("todayPage");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();

  useEffect(() => {
    track("today_view");
  }, []);

  const festival = today ? getUpcomingFestivals(today, 1)[0] : undefined;
  const festivalDays = today && festival ? Math.max(daysUntil(today, festival), 0) : null;

  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <header className="relative">
        <LeafSprig className="absolute right-0 top-0 hidden h-36 w-28 sm:block" />
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="display mt-2 text-4xl leading-tight sm:text-5xl">
          {today ? formatBengaliDate(gregorianToBengali(today), locale, toDigits) : " "}
        </h1>
        <p className="mt-2 text-lg text-ink-600 dark:text-ink-200">
          {today ? formatGregorianDate(toLocalIsoDate(today), locale, toDigits) : " "}
        </p>
        {festival && festivalDays !== null ? (
          <p className="mt-3">
            <Link
              href="/calendar"
              className="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-sindoor-700 hover:underline dark:text-sindoor-300"
            >
              <span aria-hidden="true">{festival.emoji}</span>
              {festivalDays === 0
                ? t("festivalToday", { name: bn ? festival.nameBn : festival.nameEn })
                : t("festivalIn", {
                    name: bn ? festival.nameBn : festival.nameEn,
                    days: toDigits(festivalDays)
                  })}
            </Link>
          </p>
        ) : null}
      </header>

      <div className="mt-10">
        <Daily5Tracker variant="today" />
      </div>

      <div className="mt-12 flex flex-col gap-12">
        <TodayWord />
        <TodayQuestion />
        <TodayDiscovery />
        <TodayLearn />
        <TodayAdda />
      </div>

      <nav
        aria-label={t("more")}
        className="mt-14 flex flex-wrap gap-x-6 border-t border-ink-100 pt-6 dark:border-ink-700"
      >
        <Link href="/calendar" className="btn btn-text">
          {t("calendar")}
        </Link>
        <Link href="/puja" className="btn btn-text">
          {t("puja")}
        </Link>
        <Link href="/quiz" className="btn btn-text">
          {t("quiz")}
        </Link>
      </nav>
    </Container>
  );
}
