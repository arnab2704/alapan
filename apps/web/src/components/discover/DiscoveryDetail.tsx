"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Discovery } from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { ShareButton } from "@/components/ShareButton";
import { WordPractice } from "@/components/word/WordPractice";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { recordDiscovery, type PassportCategory } from "@/lib/passport";
import { wordHref } from "@/lib/wordLinks";
import { DiscoveryCard } from "./DiscoveryCard";

export interface PracticeWord {
  word: string;
  meaningBn: string;
  meaningEn: string;
}

const PASSPORT_FOR: Record<Discovery["category"], PassportCategory> = {
  place: "places",
  person: "people",
  history: "stories",
  literature: "stories",
  food: "stories",
  song: "stories",
  cinema: "stories",
  theatre: "stories",
  art: "stories",
  science: "stories",
  tradition: "stories",
  education: "stories"
};

/** Steps through a few words tied to this subject, one build-the-word exercise at a time. */
function RelatedWordsPlay({ words }: { words: PracticeWord[] }) {
  const t = useTranslations("discover.play");
  const bn = useLocale() === "bn";
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const finished = index >= words.length;

  if (words.length === 0) return null;
  if (finished) {
    return (
      <section aria-labelledby="play-heading" className="card-learning">
        <h2 id="play-heading" className="display text-2xl">
          {t("done")}
        </h2>
        <p className="mt-1 text-ink-700 dark:text-ink-100">{t("doneBody")}</p>
        <p className="mt-3 flex flex-wrap gap-3">
          <Link href="/play/shobdoshakti" className="btn btn-primary">
            {t("playGame")}
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIndex(0);
              setSolved(false);
            }}
          >
            {t("again")}
          </button>
        </p>
      </section>
    );
  }
  const current = words[index];
  return (
    <div>
      <p className="eyebrow mb-2">
        {t("heading")} · {index + 1}/{words.length}
      </p>
      <WordPractice
        key={current.word}
        word={current.word}
        meaning={bn ? current.meaningBn : current.meaningEn}
        onSolved={() => setSolved(true)}
      />
      {solved ? (
        <p className="mt-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSolved(false);
              setIndex((i) => i + 1);
            }}
          >
            {index + 1 >= words.length ? t("finish") : t("next")}
          </button>
        </p>
      ) : null}
    </div>
  );
}

/** One discovery: what it is, the words that belong to it, what it connects to, and a way to play with those words. */
export function DiscoveryDetail({
  discovery,
  related,
  practiceWords,
  categoryLabels
}: {
  discovery: Discovery;
  related: Discovery[];
  practiceWords: PracticeWord[];
  categoryLabels: Record<string, string>;
}) {
  const t = useTranslations("discover");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";

  useEffect(() => {
    track("discover_opened", { category: discovery.category });
    recordDiscovery(PASSPORT_FOR[discovery.category], discovery.slug);
  }, [discovery.category, discovery.slug]);

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Link href="/discover" className="btn btn-text btn-sm">
        ← {t("back")}
      </Link>
      <p className="eyebrow mt-4">{categoryLabels[discovery.category]}</p>
      <h1 className="display mt-2 text-4xl leading-tight sm:text-5xl">
        {bn ? discovery.titleBn : discovery.titleEn}
      </h1>
      <p className="mt-1 text-ink-500" lang={bn ? "en" : "bn"}>
        {bn ? discovery.titleEn : discovery.titleBn}
      </p>
      <p className="display reading mt-6 text-2xl">{bn ? discovery.summaryBn : discovery.summaryEn}</p>
      <p className="mt-3 text-sm text-ink-500">
        {t("source")}: {discovery.source}
      </p>

      {discovery.relatedWords.length > 0 ? (
        <section aria-labelledby="disc-words" className="mt-10">
          <h2 id="disc-words" className="eyebrow">
            {t("words")}
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {discovery.relatedWords.map((word) => (
              <li key={word}>
                <Link
                  href={wordHref(word)}
                  lang="bn"
                  className="font-bengaliDisplay inline-flex min-h-11 items-center rounded-full border border-ink-200 bg-cream-100 px-4 text-lg font-bold hover:border-sindoor-300 hover:bg-sindoor-50 dark:border-ink-600 dark:bg-ink-800"
                >
                  {word}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {practiceWords.length > 0 ? (
        <section aria-label={t("play.heading")} className="mt-10">
          <RelatedWordsPlay words={practiceWords} />
        </section>
      ) : null}

      {related.length > 0 ? (
        <section aria-labelledby="disc-related" className="mt-10">
          <h2 id="disc-related" className="eyebrow">
            {t("related")}
          </h2>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {related.map((d) => (
              <li key={d.slug}>
                <DiscoveryCard discovery={d} bn={bn} categoryLabel={categoryLabels[d.category]} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6 dark:border-ink-700">
        <ShareButton
          label={t("share")}
          copiedLabel={t("shareCopied")}
          variant="secondary"
          analytics={{ what: "discovery" }}
          build={() => ({
            text: t("shareText", { title: bn ? discovery.titleBn : discovery.titleEn }),
            url: window.location.href
          })}
        />
        <Link href="/discover" className="btn btn-text">
          {t("more")}
        </Link>
      </div>
    </Container>
  );
}
