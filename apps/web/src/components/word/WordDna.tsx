"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getDailyWord, toBengaliDigits } from "@alapon/bengali";
import type { WordDNA as WordDNAData } from "@alapon/bengali";
import { Container } from "@alapon/ui";
import { useDaily5 } from "@/components/daily5/useDaily5";
import { ShareButton } from "@/components/ShareButton";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { recordDiscovery } from "@/lib/passport";
import { SAVED_WORDS_EVENT, isWordSaved, saveWord, unsaveWord } from "@/lib/savedWords";
import { wordHref } from "@/lib/wordLinks";
import { SpeakButton } from "./SpeakButton";
import { LeafSprig } from "@/components/brand/LeafSprig";
import { WordPractice } from "./WordPractice";

function Stars({ value, label }: { value: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="tracking-wider text-marigold-500">
      {"★".repeat(value)}
      <span className="text-ink-200 dark:text-ink-600">{"★".repeat(5 - value)}</span>
    </span>
  );
}

/**
 * Word DNA: a word as something to discover - its structure, meaning, sound, kin and story - rather
 * than a dictionary row. Works for any word; words without a curated entry still show their structure.
 */
export function WordDna({ dna }: { dna: WordDNAData }) {
  const t = useTranslations("wordDna");
  const tCat = useTranslations("wordDna.categories");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const toDigits = bn ? toBengaliDigits : (n: number) => String(n);
  const reduce = useReducedMotion();
  const daily = useDaily5();
  const [saved, setSaved] = useState(false);
  const [context, setContext] = useState<"game" | "today" | "explore">("explore");
  const { entry } = dna;

  useEffect(() => {
    track("word_dna_opened", { known: Boolean(entry), difficulty: dna.difficulty });
    recordDiscovery("words", dna.word);
    const from = new URLSearchParams(window.location.search).get("from");
    const isTodaysWord = getDailyWord(new Date()).word === dna.word;
    if (isTodaysWord) daily.mark("word");
    setContext(from === "game" ? "game" : isTodaysWord ? "today" : "explore");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dna.word]);

  useEffect(() => {
    const sync = () => setSaved(isWordSaved(dna.word));
    sync();
    window.addEventListener(SAVED_WORDS_EVENT, sync);
    return () => window.removeEventListener(SAVED_WORDS_EVENT, sync);
  }, [dna.word]);

  const meaning = entry ? (bn ? entry.meaningBn : entry.meaningEn) : "";
  const otherMeaning = entry ? (bn ? entry.meaningEn : entry.meaningBn) : "";

  function toggleSave() {
    if (saved) {
      unsaveWord(dna.word);
    } else {
      saveWord(dna.word);
      track("word_saved");
    }
  }

  return (
    <Container className="relative max-w-3xl py-8 sm:py-12">
      <Link href="/discover" className="btn btn-text btn-sm">
        ← {t("back")}
      </Link>
      <LeafSprig className="absolute right-0 top-0 hidden h-40 w-32 sm:block" />
      <p className="eyebrow mt-4 flex items-center gap-3">
        {t("eyebrow")}
        <SpeakButton word={dna.word} />
      </p>

      <h1 className="sr-only">{dna.word}</h1>
      <div aria-hidden="true" className="mt-3 flex flex-wrap gap-2" lang="bn">
        {dna.tiles.map((tile, i) => (
          <motion.span
            key={`${tile}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 14, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.35, delay: reduce ? 0 : 0.08 * i }}
            className="font-bengaliDisplay flex min-h-20 min-w-16 items-center justify-center rounded-alpona border-2 border-marigold-300 bg-gradient-to-b from-marigold-50 to-marigold-100 px-4 text-6xl font-extrabold text-ink-900 shadow-md sm:min-h-24 sm:min-w-20 sm:text-7xl"
          >
            {tile}
          </motion.span>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-500">
        {t("structure")}: <span lang="bn">{dna.tiles.join(" + ")}</span> ·{" "}
        {t("tileCount", { count: toDigits(dna.tiles.length) })}
        {dna.conjunctCount > 0 ? ` · ${t("conjuncts", { count: toDigits(dna.conjunctCount) })}` : ""}
      </p>

      {entry ? (
        <section aria-labelledby="dna-meaning" className="mt-8">
          <h2 id="dna-meaning" className="eyebrow">
            {t("meaning")}
          </h2>
          <p className="display reading mt-1 text-3xl">{meaning}</p>
          <p className="mt-1 text-ink-500" lang={bn ? "en" : "bn"}>
            {otherMeaning}
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold text-ink-500">{t("pronunciation")}</dt>
              <dd className="text-lg font-semibold">{entry.pronunciation}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-500">{t("difficulty")}</dt>
              <dd className="text-lg">
                <Stars
                  value={dna.difficulty}
                  label={t("difficultyLabel", { level: toDigits(dna.difficulty) })}
                />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-500">{t("category")}</dt>
              <dd className="text-lg font-semibold">{tCat(entry.category)}</dd>
            </div>
          </dl>
          {entry.region ? (
            <p className="reading mt-4 text-sm text-ink-600 dark:text-ink-200">
              <span className="font-semibold">{t("region")}: </span>
              {bn ? entry.region.bn : entry.region.en}
            </p>
          ) : null}
        </section>
      ) : (
        <section aria-labelledby="dna-unknown" className="card-editorial mt-8">
          <h2 id="dna-unknown" className="display text-2xl">
            {t("unknownTitle")}
          </h2>
          <p className="reading mt-1 text-ink-700 dark:text-ink-100">{t("unknownBody")}</p>
          <p className="mt-2 text-sm text-ink-500">
            {t("difficulty")}:{" "}
            <Stars value={dna.difficulty} label={t("difficultyLabel", { level: toDigits(dna.difficulty) })} />
          </p>
        </section>
      )}

      {entry?.exampleBn ? (
        <section aria-labelledby="dna-example" className="mt-8">
          <h2 id="dna-example" className="eyebrow">
            {t("example")}
          </h2>
          <p className="display reading mt-1 text-2xl" lang="bn">
            {entry.exampleBn}
          </p>
          {entry.exampleEn ? <p className="mt-1 text-ink-500">{entry.exampleEn}</p> : null}
        </section>
      ) : null}

      {dna.relatedWithEntries.length > 0 || (entry && entry.relatedWords.length > 0) ? (
        <section aria-labelledby="dna-related" className="mt-8">
          <h2 id="dna-related" className="eyebrow">
            {t("related")}
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {(entry?.relatedWords ?? []).map((related) => (
              <li key={related}>
                <Link
                  href={wordHref(related)}
                  lang="bn"
                  className="font-bengaliDisplay inline-flex min-h-11 items-center rounded-full border border-ink-200 bg-cream-100 px-4 text-lg font-bold hover:border-sindoor-300 hover:bg-sindoor-50 dark:border-ink-600 dark:bg-ink-800"
                >
                  {related}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry?.culturalNote ? (
        <section aria-labelledby="dna-story" className="card-editorial mt-8">
          <h2 id="dna-story" className="eyebrow">
            {t("story")}
          </h2>
          <p className="display reading mt-2 text-xl">{bn ? entry.culturalNote.bn : entry.culturalNote.en}</p>
        </section>
      ) : null}

      <section aria-labelledby="dna-why" className="mt-8">
        <h2 id="dna-why" className="eyebrow">
          {t("why")}
        </h2>
        <p className="reading mt-1 text-ink-700 dark:text-ink-100">{t(`whyBody.${context}`)}</p>
      </section>

      {entry ? (
        <div className="mt-8">
          <WordPractice word={dna.word} meaning={meaning} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6 dark:border-ink-700">
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={saved ? "btn btn-secondary" : "btn btn-primary"}
        >
          {saved ? `✓ ${t("saved")}` : t("save")}
        </button>
        <Link href="/play/shobdoshakti" className="btn btn-secondary">
          {t("playAgain")}
        </Link>
        <Link href="/learn" className="btn btn-secondary">
          {t("learn")}
        </Link>
        <ShareButton
          variant="secondary"
          label={t("share")}
          copiedLabel={t("shareCopied")}
          analytics={{ what: "word_dna" }}
          build={() => ({
            text: entry
              ? t("shareText", { word: dna.word, meaning })
              : t("shareTextPlain", { word: dna.word }),
            url: window.location.href.split("?")[0]
          })}
        />
      </div>
    </Container>
  );
}
