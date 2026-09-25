"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DISCOVERY_CATEGORIES,
  getAllDiscoveries,
  getDailyDiscovery,
  normalizeForSearch
} from "@alapon/bengali";
import type { DiscoveryCategory } from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";
import { DiscoveryCard } from "./DiscoveryCard";

const chip = (active: boolean) =>
  `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 ${
    active
      ? "border-sindoor-500 bg-sindoor-500 text-white"
      : "border-ink-200 bg-cream-100 text-ink-700 hover:bg-sindoor-50 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-100"
  }`;

/** The Discover hub: today's discovery, then everything, filterable by kind and searchable. Every card leads onward. */
export function DiscoverHub() {
  const t = useTranslations("discover");
  const tc = useTranslations("discover.categories");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const today = useToday();
  const [category, setCategory] = useState<DiscoveryCategory | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    if (wanted && (DISCOVERY_CATEGORIES as string[]).includes(wanted))
      setCategory(wanted as DiscoveryCategory);
  }, []);

  const featured = today ? getDailyDiscovery(today) : null;

  const shown = useMemo(() => {
    const q = normalizeForSearch(query).toLowerCase().trim();
    return getAllDiscoveries().filter((d) => {
      if (category && d.category !== category) return false;
      if (!q) return true;
      const hay = normalizeForSearch(`${d.titleBn} ${d.titleEn} ${d.summaryBn} ${d.summaryEn}`).toLowerCase();
      return hay.includes(q);
    });
  }, [category, query]);

  return (
    <Container className="py-10 sm:py-14">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="display mt-2 text-4xl sm:text-5xl">{t("heading")}</h1>
      <p className="reading mt-2 max-w-2xl text-lg text-ink-700 dark:text-ink-100">{t("description")}</p>

      {featured ? (
        <section aria-labelledby="discover-today" className="card-discovery mt-8">
          <p id="discover-today" className="eyebrow">
            {t("today")}
          </p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">{bn ? featured.titleBn : featured.titleEn}</h2>
          <p className="reading mt-2 max-w-2xl text-ink-700 dark:text-ink-100">
            {bn ? featured.summaryBn : featured.summaryEn}
          </p>
          <p className="mt-4">
            <Link href={`/discover/${featured.slug}`} className="btn btn-primary">
              {t("open")}
            </Link>
          </p>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-3">
        <label className="block">
          <span className="sr-only">{t("search")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-h-12 w-full rounded-full border-2 border-ink-200 bg-cream-100 px-5 text-base focus-visible:border-sindoor-500 focus-visible:outline-none dark:border-ink-600 dark:bg-ink-800"
          />
        </label>
        <div role="group" aria-label={t("filter")} className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={chip(category === null)}
          >
            {t("all")}
          </button>
          {DISCOVERY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={chip(category === c)}
            >
              {tc(c)}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p role="status" className="mt-8 text-ink-600">
          {t("none")}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={t("heading")}>
          {shown.map((d) => (
            <li key={d.slug}>
              <DiscoveryCard discovery={d} bn={bn} categoryLabel={tc(d.category)} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
