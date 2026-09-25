import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllFestivals, getFestivalBySlug } from "@alapon/bengali";
import { FestivalDetail } from "@/components/festival/FestivalDetail";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllFestivals().map((f) => ({ locale, slug: f.slug })));
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const festival = getFestivalBySlug(slug);
  if (!festival) return {};
  const bn = locale === "bn";
  return {
    title: bn ? festival.nameBn : festival.nameEn,
    description: bn ? festival.descriptionBn : festival.descriptionEn
  };
}

export default function FestivalPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const festival = getFestivalBySlug(slug);
  if (!festival) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: locale === "bn" ? festival.nameBn : festival.nameEn,
    description: locale === "bn" ? festival.descriptionBn : festival.descriptionEn,
    startDate: festival.date,
    endDate: festival.endDate ?? festival.date,
    inLanguage: locale
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FestivalDetail slug={slug} />
    </>
  );
}
