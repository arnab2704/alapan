"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { searchIndex, type SearchKind } from "@/lib/searchIndex";

const KIND_ORDER: SearchKind[] = ["word", "person", "place", "story", "festival", "lesson"];

export function SearchPage() {
  const t = useTranslations("search");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const [query, setQuery] = useState("");

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  const results = useMemo(() => searchIndex(query), [query]);
  const grouped = KIND_ORDER.map((kind) => ({ kind, items: results.filter((r) => r.kind === kind) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <Container className="max-w-2xl py-10 sm:py-14">
      <SectionHeading title={t("heading")} description={t("description")} />
      <label className="block">
        <span className="sr-only">{t("label")}</span>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-12 w-full rounded-full border-2 border-ink-200 bg-cream-100 px-5 text-lg text-ink-900 focus-visible:border-sindoor-500 focus-visible:outline-none dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50"
        />
      </label>

      <div aria-live="polite" className="mt-6">
        {query.trim() === "" ? (
          <p className="text-ink-500">{t("hint")}</p>
        ) : results.length === 0 ? (
          <div role="status" className="flex flex-col items-center py-6 text-center">
            <Image
              src="/images/empty/no-results.webp"
              alt=""
              width={640}
              height={480}
              className="h-40 w-auto"
            />
            <p className="mt-3 text-ink-600 dark:text-ink-200">{t("none", { query })}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {grouped.map((group) => (
              <section key={group.kind} aria-labelledby={`search-${group.kind}`}>
                <h2 id={`search-${group.kind}`} className="eyebrow mb-2">
                  {t(`kinds.${group.kind}`)}
                </h2>
                <ul className="divide-y divide-ink-100 dark:divide-ink-700">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex min-h-12 flex-col justify-center py-2 hover:text-sindoor-700"
                      >
                        <span className="font-bengaliDisplay text-lg font-bold">
                          {bn ? item.titleBn : item.titleEn}
                        </span>
                        <span className="text-sm text-ink-500" lang={bn ? "en" : "bn"}>
                          {bn ? item.titleEn : item.titleBn}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
