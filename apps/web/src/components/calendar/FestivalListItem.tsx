"use client";

import { useLocale, useTranslations } from "next-intl";
import { daysUntil, getFestivalStatus, toBengaliDigits } from "@alapon/bengali";
import type { Festival } from "@alapon/bengali";
import { Badge } from "@alapon/ui";
import { formatGregorianDate, formatGregorianRange } from "@/lib/formatDate";

export interface FestivalListItemProps {
  festival: Festival;
  today: Date;
}

export function FestivalListItem({ festival, today }: FestivalListItemProps) {
  const t = useTranslations("calendar");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);

  const status = getFestivalStatus(today, festival);
  const days = daysUntil(today, festival);
  const name = locale === "bn" ? festival.nameBn : festival.nameEn;
  const description = locale === "bn" ? festival.descriptionBn : festival.descriptionEn;

  return (
    <li className="flex flex-col gap-3 rounded-alpona border border-ink-100 bg-cream-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-ink-700 dark:bg-ink-800">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="text-2xl leading-none">
          {festival.emoji}
        </span>
        <div>
          <h3 className="font-bengaliDisplay text-lg font-semibold text-ink-900 dark:text-ink-50">{name}</h3>
          <p className="mt-0.5 text-sm text-ink-600 dark:text-ink-200">{description}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
        <Badge tone="muted">
          {festival.endDate
            ? formatGregorianRange(festival.date, festival.endDate, locale, toDigits)
            : formatGregorianDate(festival.date, locale, toDigits)}
        </Badge>
        {status === "ongoing" ? (
          <Badge tone="gold">{t("ongoing")}</Badge>
        ) : (
          <span className="text-xs text-ink-400">{t("daysToGo", { days: toDigits(days) })}</span>
        )}
      </div>
    </li>
  );
}
