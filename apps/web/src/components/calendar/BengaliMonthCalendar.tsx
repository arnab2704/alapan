"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  addBengaliMonths,
  bengaliMonthLength,
  bengaliMonthStartWeekday,
  bengaliToGregorian,
  BENGALI_MONTHS,
  BENGALI_WEEKDAYS_SHORT,
  getAllFestivals,
  gregorianToBengali,
  toBengaliDigits
} from "@alapon/bengali";
import { Card } from "@alapon/ui";
import { toLocalIsoDate } from "@/lib/formatDate";

export interface BengaliMonthCalendarProps {
  /** Defaults to today's Bengali month/year. */
  initialYear: number;
  initialMonth: number;
  todayIso: string;
}

interface DayCell {
  bengaliDay: number;
  gregorian: Date;
  iso: string;
}

interface DayFestival {
  emoji: string;
  nameBn: string;
  nameEn: string;
}

/** Every festival day this year's data covers, keyed by ISO date, for the month-grid's marker dots. */
function useFestivalsByDate(): Map<string, DayFestival> {
  return useMemo(() => {
    const byDate = new Map<string, DayFestival>();
    for (const festival of getAllFestivals()) {
      const days = festival.days?.map((d) => d.date) ?? [festival.date];
      for (const date of days) {
        byDate.set(date, { emoji: festival.emoji, nameBn: festival.nameBn, nameEn: festival.nameEn });
      }
    }
    return byDate;
  }, []);
}

/** A traditional month-grid Bengali calendar: the Bengali date leads, the Gregorian date is secondary. */
export function BengaliMonthCalendar({ initialYear, initialMonth, todayIso }: BengaliMonthCalendarProps) {
  const t = useTranslations("calendar");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const festivalsByDate = useFestivalsByDate();

  const [{ year, month }, setCursor] = useState({ year: initialYear, month: initialMonth });

  const monthLength = bengaliMonthLength(year, month);
  const startWeekday = bengaliMonthStartWeekday(year, month);
  const monthInfo = BENGALI_MONTHS[month - 1];

  const days: DayCell[] = useMemo(() => {
    const cells: DayCell[] = [];
    for (let day = 1; day <= monthLength; day++) {
      const gregorian = bengaliToGregorian(year, month, day);
      cells.push({ bengaliDay: day, gregorian, iso: toLocalIsoDate(gregorian) });
    }
    return cells;
  }, [year, month, monthLength]);

  const leadingBlanks = Array.from({ length: startWeekday });
  const weekdayLabels =
    locale === "bn" ? BENGALI_WEEKDAYS_SHORT.map((d) => d.bn) : BENGALI_WEEKDAYS_SHORT.map((d) => d.en);

  function goToMonth(delta: number) {
    setCursor((current) => addBengaliMonths(current.year, current.month, delta));
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label={t("monthGrid.previousMonth")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600 dark:border-ink-600 dark:hover:bg-ink-700"
        >
          ‹
        </button>
        <p className="font-bengaliDisplay text-lg font-bold text-ink-900 dark:text-ink-50">
          {locale === "bn" ? monthInfo.bn : monthInfo.en} {toDigits(year)}
        </p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label={t("monthGrid.nextMonth")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-600 hover:bg-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600 dark:border-ink-600 dark:hover:bg-ink-700"
        >
          ›
        </button>
      </div>

      <div
        className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-400"
        aria-hidden="true"
      >
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div
        role="grid"
        aria-label={`${locale === "bn" ? monthInfo.bn : monthInfo.en} ${toDigits(year)}`}
        className="mt-1 grid grid-cols-7 gap-1"
      >
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} aria-hidden="true" />
        ))}
        {days.map((cell) => {
          const isToday = cell.iso === todayIso;
          const festival = festivalsByDate.get(cell.iso);
          const monthName = locale === "bn" ? monthInfo.bn : monthInfo.en;
          const festivalName = festival ? (locale === "bn" ? festival.nameBn : festival.nameEn) : null;
          const cellLabel = [
            `${toDigits(cell.bengaliDay)} ${monthName} ${toDigits(year)}`,
            isToday ? t("todayExclaim") : null,
            festivalName
          ]
            .filter(Boolean)
            .join(" - ");
          return (
            <div
              key={cell.iso}
              role="gridcell"
              aria-current={isToday ? "date" : undefined}
              aria-label={cellLabel}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-sm ${
                isToday
                  ? "border-sindoor-500 bg-sindoor-50 font-bold text-sindoor-700 dark:bg-sindoor-900/30 dark:text-sindoor-300"
                  : "border-transparent text-ink-800 hover:border-ink-200 dark:text-ink-100"
              }`}
            >
              <span aria-hidden="true">{toDigits(cell.bengaliDay)}</span>
              <span aria-hidden="true" className="text-[10px] leading-tight text-ink-400">
                {cell.gregorian.getDate()}
              </span>
              {festival ? (
                <span aria-hidden="true" className="text-[10px] leading-none">
                  {festival.emoji}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
