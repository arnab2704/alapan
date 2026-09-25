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
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { formatGregorianDate, toLocalIsoDate } from "@/lib/formatDate";

/** "Today's Alapon": today's Bengali date, the Gregorian date and the next festival, in one calm strip. */
export function HomeToday() {
  const t = useTranslations("homePage.today");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();

  useEffect(() => {
    track("homepage_view");
  }, []);

  const festival = today ? getUpcomingFestivals(today, 1)[0] : undefined;
  const days = today && festival ? Math.max(daysUntil(today, festival), 0) : null;

  return (
    <section
      aria-labelledby="home-today-heading"
      className="border-y border-ink-100 bg-cream-100/70 py-6 dark:border-ink-700 dark:bg-ink-800/40"
    >
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="home-today-heading" className="eyebrow">
            {t("heading")}
          </h2>
          <p className="display mt-1 text-3xl sm:text-4xl">
            {today ? formatBengaliDate(gregorianToBengali(today), locale, toDigits) : " "}
          </p>
          <p className="text-ink-600 dark:text-ink-200">
            {today ? formatGregorianDate(toLocalIsoDate(today), locale, toDigits) : " "}
          </p>
        </div>
        {festival && days !== null ? (
          <Link
            href="/puja"
            className="flex min-h-11 items-center gap-2 rounded-full border border-marigold-300 bg-marigold-50 px-4 text-sm font-semibold text-ink-800 hover:bg-marigold-100 dark:border-marigold-700 dark:bg-ink-800 dark:text-ink-100"
          >
            <span aria-hidden="true" className="text-lg">
              {festival.emoji}
            </span>
            {days === 0
              ? t("festivalToday", { name: bn ? festival.nameBn : festival.nameEn })
              : t("festivalIn", { name: bn ? festival.nameBn : festival.nameEn, days: toDigits(days) })}
          </Link>
        ) : null}
      </Container>
    </section>
  );
}
