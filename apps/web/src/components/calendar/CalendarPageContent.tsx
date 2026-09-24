"use client";

import { useTranslations } from "next-intl";
import { getUpcomingFestivals, gregorianToBengali } from "@alapon/bengali";
import { Container, SectionHeading } from "@alapon/ui";
import { toLocalIsoDate } from "@/lib/formatDate";
import { BengaliDateCard } from "./BengaliDateCard";
import { BengaliMonthCalendar } from "./BengaliMonthCalendar";
import { FestivalListItem } from "./FestivalListItem";
import { FestivalSpotlight } from "./FestivalSpotlight";
import { useToday } from "./useToday";

function SkeletonRow() {
  return <div className="h-20 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700" aria-hidden="true" />;
}

export function CalendarPageContent() {
  const t = useTranslations("calendar");
  const today = useToday();
  const upcoming = today ? getUpcomingFestivals(today) : [];
  const [next, ...rest] = upcoming;

  return (
    <Container className="py-8 sm:py-12">
      <SectionHeading eyebrow={t("todayLabel")} title={t("heading")} description={t("description")} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        <BengaliDateCard />
        {today ? (
          next ? (
            <FestivalSpotlight festival={next} today={today} />
          ) : (
            <p className="text-ink-500">{t("noUpcoming")}</p>
          )
        ) : (
          <SkeletonRow />
        )}
      </div>

      <div className="mt-10">
        <SectionHeading title={t("monthGrid.heading")} description={t("monthGrid.description")} />
        {today ? (
          <BengaliMonthCalendar
            initialYear={gregorianToBengali(today).year}
            initialMonth={gregorianToBengali(today).month}
            todayIso={toLocalIsoDate(today)}
          />
        ) : (
          <div className="h-96 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700" aria-hidden="true" />
        )}
      </div>

      <div className="mt-10">
        <SectionHeading title={t("allFestivalsHeading")} />
        {today ? (
          rest.length > 0 ? (
            <ol className="flex flex-col gap-3">
              {rest.map((festival) => (
                <FestivalListItem key={festival.slug} festival={festival} today={today} />
              ))}
            </ol>
          ) : (
            <p className="text-ink-500">{t("noUpcoming")}</p>
          )
        ) : (
          <div className="flex flex-col gap-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-ink-400">{t("disclaimer")}</p>
    </Container>
  );
}
