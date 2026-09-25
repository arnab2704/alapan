import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  DISCOVERY_CATEGORIES,
  getAllDiscoveries,
  getDiscovery,
  getRelatedDiscoveries,
  getWordEntry
} from "@alapon/bengali";
import { DiscoveryDetail } from "@/components/discover/DiscoveryDetail";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllDiscoveries().map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const discovery = getDiscovery(slug);
  if (!discovery) return {};
  const bn = locale === "bn";
  return {
    title: bn ? discovery.titleBn : discovery.titleEn,
    description: bn ? discovery.summaryBn : discovery.summaryEn,
    openGraph: {
      title: bn ? discovery.titleBn : discovery.titleEn,
      description: bn ? discovery.summaryBn : discovery.summaryEn
    }
  };
}

export default async function DiscoveryPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const discovery = getDiscovery(slug);
  if (!discovery) notFound();

  const tc = await getTranslations("discover.categories");
  const categoryLabels = Object.fromEntries(DISCOVERY_CATEGORIES.map((c) => [c, tc(c)]));
  const practiceWords = discovery.relatedWords
    .map((word) => getWordEntry(word))
    .filter(
      (entry): entry is NonNullable<typeof entry> => entry !== null && Array.from(entry.word).length >= 2
    )
    .slice(0, 4)
    .map((entry) => ({ word: entry.word, meaningBn: entry.meaningBn, meaningEn: entry.meaningEn }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: locale === "bn" ? discovery.titleBn : discovery.titleEn,
    description: locale === "bn" ? discovery.summaryBn : discovery.summaryEn,
    inLanguage: locale
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DiscoveryDetail
        discovery={discovery}
        related={getRelatedDiscoveries(discovery)}
        practiceWords={practiceWords}
        categoryLabels={categoryLabels}
      />
    </>
  );
}
