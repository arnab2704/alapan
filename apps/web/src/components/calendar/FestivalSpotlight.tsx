"use client";

import { useLocale, useTranslations } from "next-intl";
import { daysUntil, getFestivalStatus, toBengaliDigits } from "@alapon/bengali";
import type { Festival } from "@alapon/bengali";
import { Badge, Card } from "@alapon/ui";
import { formatGregorianDate, formatGregorianRange } from "@/lib/formatDate";

export interface FestivalSpotlightProps {
  festival: Festival;
  today: Date;
}

/**
 * The hero "glimpse" card for whichever festival is coming up next -
 * bigger and warmer than a plain list row, with Durga Puja getting its
 * own eyebrow/heading copy and a day-by-day (Shashthi..Dashami) schedule
 * strip when the festival has one.
 */
export function FestivalSpotlight({ festival, today }: FestivalSpotlightProps) {
  const t = useTranslations("calendar");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);

  const isDurgaPuja = festival.slug.startsWith("durga-puja");
  const status = getFestivalStatus(today, festival);
  const days = daysUntil(today, festival);
  const name = locale === "bn" ? festival.nameBn : festival.nameEn;
  const description = locale === "bn" ? festival.descriptionBn : festival.descriptionEn;

  return (
    <Card className="relative overflow-hidden border-t-4 border-t-sindoor-500 bg-gradient-to-br from-marigold-50 via-cream-50 to-cream-50 dark:from-ink-800 dark:via-ink-800 dark:to-ink-800">
      <p className="font-bengali text-sm font-semibold uppercase tracking-wide text-sindoor-600">
        {isDurgaPuja ? t("durgaPuja.eyebrow") : t("upcomingHeading")}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <span aria-hidden="true" className="text-4xl leading-none">
          {festival.emoji}
        </span>
        <div>
          <h3 className="font-bengaliDisplay text-2xl font-bold text-ink-900 dark:text-ink-50">
            {isDurgaPuja ? t("durgaPuja.heading") : name}
          </h3>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">
            {isDurgaPuja ? t("durgaPuja.description") : description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="festival">
          {festival.endDate
            ? formatGregorianRange(festival.date, festival.endDate, locale, toDigits)
            : formatGregorianDate(festival.date, locale, toDigits)}
        </Badge>
        {status === "ongoing" ? (
          <Badge tone="gold">{t("ongoing")}</Badge>
        ) : days === 0 ? (
          <Badge tone="gold">{t("todayExclaim")}</Badge>
        ) : (
          <Badge tone="muted">{t("daysToGo", { days: toDigits(days) })}</Badge>
        )}
      </div>

      {festival.days ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {t("durgaPuja.daySchedule")}
          </p>
          <ol className="mt-2 flex flex-wrap gap-2">
            {festival.days.map((day) => (
              <li
                key={day.date}
                className="rounded-full border border-sindoor-200 bg-cream-50 px-3 py-1 text-xs font-medium text-ink-700 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-200"
              >
                {locale === "bn" ? day.labelBn : day.labelEn} ·{" "}
                {formatGregorianDate(day.date, locale, toDigits)}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </Card>
  );
}
