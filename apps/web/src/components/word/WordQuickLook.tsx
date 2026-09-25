"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { WordDNA } from "@alapon/bengali";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { recordDiscovery } from "@/lib/passport";
import { wordHref } from "@/lib/wordLinks";

/**
 * A small "learn this word" sheet that opens over the game without leaving it: meaning, sound, an
 * example and where to go deeper. It loads the word bank only when first opened, so the game
 * itself stays light.
 */
export function WordQuickLook({ word, onClose }: { word: string; onClose: () => void }) {
  const t = useTranslations("wordDna");
  const locale = useLocale() as "bn" | "en";
  const bn = locale === "bn";
  const [dna, setDna] = useState<WordDNA | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/wordLookup").then(({ getWordDNA }) => {
      if (cancelled) return;
      setDna(getWordDNA(word));
      track("word_dna_opened", { source: "quicklook" });
      recordDiscovery("words", word);
    });
    return () => {
      cancelled = true;
    };
  }, [word]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      previous?.focus?.();
    };
  }, [onClose]);

  const entry = dna?.entry ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-3 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quicklook-word"
        onClick={(event) => event.stopPropagation()}
        className="card-result w-full max-w-md text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow">{t("quickLook")}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <h2 id="quicklook-word" className="display mt-1 text-5xl" lang="bn">
          {word}
        </h2>
        {dna === null ? (
          <p role="status" className="mt-3 text-ink-500">
            …
          </p>
        ) : entry ? (
          <div className="reading mt-3">
            <p className="text-xl font-semibold">{bn ? entry.meaningBn : entry.meaningEn}</p>
            <p className="text-sm text-ink-500">
              {entry.pronunciation} · {dna.tiles.join(" + ")}
            </p>
            <p className="mt-2 text-ink-700 dark:text-ink-100" lang="bn">
              {entry.exampleBn}
            </p>
          </div>
        ) : (
          <div className="reading mt-3">
            <p className="text-ink-700 dark:text-ink-100">{t("unknownBody")}</p>
            <p className="mt-1 text-sm text-ink-500" lang="bn">
              {dna.tiles.join(" + ")}
            </p>
          </div>
        )}
        <p className="mt-4 flex flex-wrap gap-3">
          <Link href={wordHref(word, "game")} className="btn btn-primary" onClick={onClose}>
            {entry ? t("dnaAndPractice") : t("openDna")}
          </Link>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            {t("backToGame")}
          </button>
        </p>
      </div>
    </div>
  );
}
