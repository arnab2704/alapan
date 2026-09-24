import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
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
  "/theke-adda"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))
      }
    }))
  );
}
