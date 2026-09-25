"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { daysUntil, getFestivalBySlug, toBengaliDigits } from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { ShareButton } from "@/components/ShareButton";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";
import { formatGregorianDate, toLocalIsoDate } from "@/lib/formatDate";
import { recordDiscovery } from "@/lib/passport";

export function FestivalDetail({ slug }: { slug: string }) {
  const t = useTranslations("festival");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();
  const festival = getFestivalBySlug(slug);

  useEffect(() => {
    recordDiscovery("festivals", slug);
  }, [slug]);

  if (!festival) return null;
  const name = bn ? festival.nameBn : festival.nameEn;
  const endIso = festival.endDate ?? festival.date;
  const todayIso = today ? toLocalIsoDate(today) : null;
  const left = today ? daysUntil(today, festival) : null;
  let status = "";
  if (todayIso) {
    if (todayIso > endIso) status = t("ended");
    else if (todayIso >= festival.date) status = t("now");
    else if (left !== null) status = t("inDays", { count: toDigits(left) });
  }
  const fmt = (iso: string) => formatGregorianDate(iso, locale, toDigits);

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Link href="/calendar" className="btn btn-text btn-sm">
        ← {t("back")}
      </Link>
      <p className="eyebrow mt-4">{t("eyebrow")}</p>
      <h1 className="display mt-2 text-4xl sm:text-5xl">
        <span aria-hidden="true">{festival.emoji} </span>
        {name}
      </h1>
      <p className="mt-2 text-ink-600" lang={bn ? "en" : "bn"}>
        {bn ? festival.nameEn : festival.nameBn}
      </p>
      <p className="mt-4 font-semibold text-sindoor-700">
        {festival.endDate ? `${fmt(festival.date)} - ${fmt(festival.endDate)}` : fmt(festival.date)}
        {status ? <span className="ml-2 text-ink-600">· {status}</span> : null}
      </p>
      <p className="display reading mt-6 text-2xl">{bn ? festival.descriptionBn : festival.descriptionEn}</p>
      {festival.lunisolar ? (
        <p className="mt-3 rounded-lg bg-marigold-50 p-3 text-sm text-ink-700 dark:bg-ink-800 dark:text-ink-100">
          {t("lunisolar")}
        </p>
      ) : null}

      {festival.days && festival.days.length > 0 ? (
        <section aria-labelledby="fest-days" className="mt-10">
          <h2 id="fest-days" className="eyebrow">
            {t("days")}
          </h2>
          <ol className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
            {festival.days.map((d) => (
              <li key={d.date} className="flex items-baseline justify-between gap-4 py-3">
                <span className="font-bengaliDisplay text-lg font-bold">{bn ? d.labelBn : d.labelEn}</span>
                <span className="text-sm text-ink-600">{fmt(d.date)}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section aria-labelledby="fest-more" className="card-discovery mt-10">
        <h2 id="fest-more" className="display text-2xl">
          {t("explore")}
        </h2>
        <p className="mt-3 flex flex-wrap gap-3">
          {slug.startsWith("durga-puja") ? (
            <Link href="/puja" className="btn btn-primary">
              {t("pujaPassport")}
            </Link>
          ) : null}
          <Link href="/discover" className="btn btn-secondary">
            {t("discover")}
          </Link>
          <Link href="/play/shobdoshakti" className="btn btn-secondary">
            {t("play")}
          </Link>
        </p>
      </section>

      <div className="mt-8">
        <ShareButton
          label={t("share")}
          copiedLabel={t("shareCopied")}
          variant="secondary"
          analytics={{ what: "festival" }}
          build={() => ({ text: t("shareText", { name }), url: window.location.href })}
        />
      </div>
    </Container>
  );
}
