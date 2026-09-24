"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatBengaliDate, gregorianToBengali, toBengaliDigits } from "@alapon/bengali";
import { Card } from "@alapon/ui";
import { formatGregorianDate, toLocalIsoDate } from "@/lib/formatDate";
import { useToday } from "./useToday";

export interface BengaliDateCardProps {
  className?: string;
}

/** Compact "today's date" card: Bengali (Bangabda) date first, Gregorian date as a secondary line. */
export function BengaliDateCard({ className }: BengaliDateCardProps) {
  const t = useTranslations("calendar");
  const locale = useLocale() as "bn" | "en";
  const today = useToday();

  if (!today) {
    return (
      <Card className={className} aria-busy="true">
        <div className="h-4 w-32 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
        <div className="mt-3 h-7 w-48 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
        <div className="mt-2 h-4 w-36 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
      </Card>
    );
  }

  const bengaliDate = gregorianToBengali(today);
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);

  return (
    <Card className={className}>
      <p className="text-sm font-medium text-ink-500">{t("todayLabel")}</p>
      <p className="font-bengaliDisplay mt-1 text-2xl font-bold text-sindoor-600">
        {formatBengaliDate(bengaliDate, locale, toDigits)}
      </p>
      <p className="mt-1 text-sm text-ink-400">
        {t("gregorianLabel")}: {formatGregorianDate(toLocalIsoDate(today), locale, toDigits)}
      </p>
    </Card>
  );
}
