"use client";

import { useLocale, useTranslations } from "next-intl";
import { getDailyWord, getHistoryForDate, getPersonOfTheDay, toBengaliDigits } from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { useToday } from "@/components/calendar/useToday";
import { Link } from "@/i18n/navigation";

/** "Today's Word" and "Discover Bengal": short teasers that lead into the Today page and Discover. */
export function HomeWordAndDiscover() {
  const t = useTranslations("homePage");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const today = useToday();

  const word = today ? getDailyWord(today) : null;
  const person = today ? getPersonOfTheDay(today) : null;
  const history = today ? getHistoryForDate(today) : null;

  return (
    <section aria-labelledby="home-word-heading" className="py-10 sm:py-14">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <div>
          <p className="eyebrow">{t("word.eyebrow")}</p>
          <h2 id="home-word-heading" className="display mt-2 text-5xl sm:text-6xl" lang="bn">
            {word?.word ?? " "}
          </h2>
          <p className="mt-1 text-lg text-ink-500">{word?.roman ?? " "}</p>
          <p className="reading mt-3 max-w-sm text-ink-700 dark:text-ink-100">
            {word ? (bn ? word.meaningBn : word.meaningEn) : " "}
          </p>
          <p className="mt-4">
            <Link href="/today#word" className="btn btn-secondary">
              {t("word.cta")}
            </Link>
          </p>
        </div>

        <div>
          <p className="eyebrow">{t("discover.eyebrow")}</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">{t("discover.heading")}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <article className="card-editorial">
              <h3 className="text-sm font-bold text-sindoor-700 dark:text-sindoor-300">
                {t("discover.person")}
              </h3>
              <p className="display mt-1 text-xl">{person ? (bn ? person.nameBn : person.nameEn) : " "}</p>
              <p className="mt-1 text-sm text-ink-500">
                {person ? (bn ? person.fieldBn : person.fieldEn) : " "}
              </p>
            </article>
            <article className="card-editorial">
              <h3 className="text-sm font-bold text-sindoor-700 dark:text-sindoor-300">
                {t("discover.history")}
              </h3>
              <p className="display mt-1 text-xl">
                {history ? (bn ? history.event.titleBn : history.event.titleEn) : " "}
              </p>
              <p className="mt-1 text-sm text-ink-500">{history ? toDigits(history.event.year) : " "}</p>
            </article>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-6">
            <Link href="/discover" className="btn btn-text">
              {t("discover.cta")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
