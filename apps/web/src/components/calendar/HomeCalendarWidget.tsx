"use client";

import { useTranslations } from "next-intl";
import { getUpcomingFestivals } from "@alapon/bengali";
import { Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { BengaliDateCard } from "./BengaliDateCard";
import { FestivalSpotlight } from "./FestivalSpotlight";
import { useToday } from "./useToday";

/** Homepage "what's happening today" strip: Bengali date + a glimpse of the next festival. */
export function HomeCalendarWidget() {
  const t = useTranslations("calendar");
  const today = useToday();
  const next = today ? getUpcomingFestivals(today, 1)[0] : undefined;

  return (
    <section className="border-b border-ink-100 bg-cream-100/60 py-12 dark:border-ink-700 dark:bg-ink-800/40 sm:py-16">
      <Container>
        <SectionHeading eyebrow={t("todayLabel")} title={t("heading")} description={t("description")} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
          <BengaliDateCard />
          {today ? (
            next ? (
              <FestivalSpotlight festival={next} today={today} />
            ) : null
          ) : (
            <div
              className="h-48 animate-pulse rounded-alpona bg-ink-100 dark:bg-ink-700"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/calendar"
            className="text-sm font-semibold text-sindoor-600 underline decoration-dotted hover:text-sindoor-700"
          >
            {t("viewFull")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
