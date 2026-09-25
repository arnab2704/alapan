import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllWordEntries, getWordDNA } from "@alapon/bengali";
import { WordDna } from "@/components/word/WordDna";
import { routing } from "@/i18n/routing";
import { wordFromSlug, wordSlug } from "@/lib/wordLinks";

export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllWordEntries().map((entry) => ({ locale, slug: wordSlug(entry.word) }))
  );
}

/** Any Bengali word can have a DNA page, but only reasonably short strings made of Bengali letters. */
function validWord(word: string): boolean {
  return word.length > 0 && word.length <= 24 && /^[ঀ-৿]+$/.test(word);
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const word = wordFromSlug(slug);
  if (!validWord(word)) return { robots: { index: false } };
  const t = await getTranslations({ locale, namespace: "wordDna" });
  const { entry } = getWordDNA(word);
  const meaning = entry ? (locale === "bn" ? entry.meaningBn : entry.meaningEn) : "";
  return {
    title: `${word} - ${t("eyebrow")}`,
    description: entry ? `${word}: ${meaning}` : t("unknownBody"),
    // Thin pages (no curated meaning) are for readers, not for search engines.
    robots: entry ? undefined : { index: false }
  };
}

export default async function WordPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const word = wordFromSlug(slug);
  if (!validWord(word)) notFound();
  const dna = getWordDNA(word);

  const jsonLd = dna.entry
    ? {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: dna.word,
        description: locale === "bn" ? dna.entry.meaningBn : dna.entry.meaningEn,
        inLanguage: "bn",
        inDefinedTermSet: "Alapon Word DNA"
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <WordDna dna={dna} />
    </>
  );
}
