"use client";

import { useLocale, useTranslations } from "next-intl";
import { getLearnUnits } from "@alapon/game-engine";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { useSpeech } from "./useSpeech";

/** Reference chart of every letter, sign and digit in the course, with tap-to-hear where the device has a Bengali voice. */
export function AlphabetChart() {
  const t = useTranslations("learn");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const { available, speak } = useSpeech();
  const units = getLearnUnits().filter((u) => ["vowels", "consonants", "signs", "numbers"].includes(u.id));

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("chartTitle")} description={t("chartDescription")} />
      <Link
        href="/learn"
        className="mb-6 inline-block text-sm font-semibold text-sindoor-600 underline decoration-dotted"
      >
        {t("backToPath")}
      </Link>
      <div className="flex flex-col gap-6">
        {units.map((unit) => {
          const items = unit.lessons.filter((l) => !l.review).flatMap((l) => l.items);
          return (
            <Card key={unit.id}>
              <h2 className="font-bengaliDisplay mb-3 text-xl font-bold">
                {bn ? unit.titleBn : unit.titleEn}
              </h2>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => speak(item.word ?? item.bn)}
                      disabled={!available}
                      title={item.hint}
                      className="flex w-full flex-col items-center rounded-lg border border-ink-100 p-2 hover:border-sindoor-300 hover:bg-sindoor-50 disabled:cursor-default disabled:hover:border-ink-100 disabled:hover:bg-transparent dark:border-ink-700 dark:hover:bg-ink-700"
                    >
                      <span className="font-bengaliDisplay text-3xl font-extrabold" lang="bn">
                        {item.bn}
                      </span>
                      <span className="text-xs text-ink-500">{item.roman}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
      {available ? null : <p className="mt-4 text-xs text-ink-400">{t("noVoice")}</p>}
    </Container>
  );
}
