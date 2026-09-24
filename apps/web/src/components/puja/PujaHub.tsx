"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { daysUntil, getFestivalBySlug, toBengaliDigits } from "@alapon/bengali";
import { Badge, Card, Container, SectionHeading } from "@alapon/ui";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";
import { formatGregorianDate, toLocalIsoDate } from "@/lib/formatDate";
import { readPassport, stampPassport } from "@/lib/pujaPassport";

const SLUG = "durga-puja-2026";
const STAMP_EMOJI = ["🎶", "🥁", "🌼", "🪔", "🌾", "🍬"];

export function PujaHub() {
  const t = useTranslations("puja");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();
  const [stamps, setStamps] = useState<string[]>([]);

  useEffect(() => {
    setStamps(readPassport(SLUG));
  }, []);

  const festival = getFestivalBySlug(SLUG);
  if (!festival) return null;
  const days = festival.days ?? [];
  const endIso = festival.endDate ?? festival.date;
  const pujaStart = days[1]?.date ?? festival.date;

  const todayIso = today ? toLocalIsoDate(today) : null;
  const daysToPuja = today ? daysUntil(today, { ...festival, date: pujaStart }) : null;

  let status = "";
  if (todayIso && daysToPuja !== null) {
    if (todayIso > endIso) status = t("ended");
    else if (daysToPuja > 0) status = t("countdown", { days: toDigits(daysToPuja) });
    else if (daysToPuja === 0) status = t("startsToday");
    else status = t("ongoing");
  }

  const stampedCount = days.filter((d) => stamps.includes(d.date)).length;
  const complete = days.length > 0 && stampedCount === days.length;
  const headingClass = "font-bengaliDisplay mt-8 text-xl font-bold text-ink-900 dark:text-ink-50";

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("heading")} description={t("description")} />

      <Card className="border-t-4 border-t-sindoor-400 text-center">
        <p className="text-4xl" aria-hidden="true">
          🪔
        </p>
        <p
          role="status"
          className="font-bengaliDisplay mt-2 text-2xl font-extrabold text-sindoor-700 dark:text-sindoor-300"
        >
          {status || " "}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          {formatGregorianDate(festival.date, locale, toDigits)} -{" "}
          {formatGregorianDate(endIso, locale, toDigits)}
        </p>
      </Card>

      <h2 className={headingClass}>{t("timelineTitle")}</h2>
      <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => (
          <li
            key={day.date}
            className="rounded-alpona border border-ink-100 bg-cream-100 p-4 dark:border-ink-700 dark:bg-ink-800"
          >
            <p className="font-bengaliDisplay text-lg font-bold text-ink-900 dark:text-ink-50">
              {bn ? day.labelBn : day.labelEn}
            </p>
            <p className="text-sm text-ink-500">{formatGregorianDate(day.date, locale, toDigits)}</p>
          </li>
        ))}
      </ol>

      <h2 className={headingClass}>{t("passportTitle")}</h2>
      <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("passportDescription")}</p>
      <p className="mt-2 text-sm font-semibold text-shapla-700 dark:text-shapla-300">
        {t("progress", { count: toDigits(stampedCount), total: toDigits(days.length) })}
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {days.map((day, i) => {
          const stamped = stamps.includes(day.date);
          const open = todayIso !== null && day.date <= todayIso;
          return (
            <li
              key={day.date}
              className={`flex flex-col items-center gap-2 rounded-alpona border-2 p-4 text-center ${
                stamped
                  ? "border-shapla-400 bg-shapla-50 dark:bg-ink-800"
                  : "border-dashed border-ink-200 dark:border-ink-600"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                {stamped ? STAMP_EMOJI[i % STAMP_EMOJI.length] : "◌"}
              </span>
              <span className="font-bengaliDisplay font-bold">{bn ? day.labelBn : day.labelEn}</span>
              {stamped ? (
                <Badge tone="gold">{t("stamped")}</Badge>
              ) : open ? (
                <button
                  type="button"
                  onClick={() => setStamps(stampPassport(SLUG, day.date))}
                  className="min-h-11 rounded-full bg-sindoor-500 px-4 text-sm font-semibold text-white hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
                >
                  {t("stamp")}
                </button>
              ) : (
                <span className="text-xs text-ink-400">{t("locked")}</span>
              )}
            </li>
          );
        })}
      </ul>
      {complete ? (
        <p role="status" className="mt-4 font-bold text-shapla-700 dark:text-shapla-300">
          {t("complete")}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-ink-400">{t("privacy")}</p>

      <Card className="mt-8 flex flex-col items-start gap-3 border-t-4 border-t-marigold-400">
        <h2 className="font-bengaliDisplay text-xl font-bold text-ink-900 dark:text-ink-50">
          {t("challengeTitle")}
        </h2>
        <p className="text-sm text-ink-600 dark:text-ink-200">{t("challengeDescription")}</p>
        <Link
          href="/quiz/daily"
          className="inline-flex min-h-11 items-center rounded-full bg-sindoor-500 px-5 text-sm font-semibold text-white hover:bg-sindoor-600"
        >
          {t("challengeCta")}
        </Link>
      </Card>
    </Container>
  );
}
