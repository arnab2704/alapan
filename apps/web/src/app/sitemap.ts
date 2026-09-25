import type { MetadataRoute } from "next";
import { getAllDiscoveries, getAllFestivals, getAllWordEntries } from "@alapon/bengali";
import { routing } from "@/i18n/routing";
import { wordSlug } from "@/lib/wordLinks";
import { SITE_URL } from "@/lib/siteUrl";

const PATHS = [
  "",
  "/today",
  "/play",
  "/play/shobdoshakti",
  "/quiz",
  "/quiz/daily",
  "/calendar",
  "/puja",
  "/learn",
  "/learn/alphabet",
  "/leaderboard",
  "/discover",
  "/theke-adda",
  "/terms",
  "/privacy",
  "/copyright-policy",
  "/safety",
  "/report-copyright"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...PATHS,
    ...getAllFestivals().map((f) => `/festival/${f.slug}`),
    ...getAllDiscoveries().map((d) => `/discover/${d.slug}`),
    ...getAllWordEntries().map((w) => `/word/${wordSlug(w.word)}`)
  ];
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))
      }
    }))
  );
}
