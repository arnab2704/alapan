import { getAllCulturePeople, getAllHistoryEvents } from "./culture";
import { DISCOVERIES } from "./data/discoveries";
import type { Discovery, DiscoveryCategory } from "./data/discoveries";

export type { Discovery, DiscoveryCategory };

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  "place",
  "person",
  "history",
  "literature",
  "food",
  "song",
  "cinema",
  "theatre",
  "art",
  "science",
  "tradition",
  "education"
];

let cache: Discovery[] | null = null;

function build(): Discovery[] {
  const authored = new Map(DISCOVERIES.map((d) => [d.slug, d]));
  const all: Discovery[] = [...DISCOVERIES];

  for (const p of getAllCulturePeople()) {
    if (authored.has(p.slug)) continue;
    all.push({
      slug: p.slug,
      category: "person",
      titleBn: p.nameBn,
      titleEn: p.nameEn,
      summaryBn: `${p.fieldBn} (${p.lifeBn}). ${p.blurbBn}`,
      summaryEn: `${p.fieldEn} (${p.lifeEn}). ${p.blurbEn}`,
      relatedWords: [],
      relatedSlugs: [],
      source: "Alapon editorial"
    });
  }
  for (const e of getAllHistoryEvents()) {
    if (authored.has(e.slug)) continue;
    all.push({
      slug: e.slug,
      category: "history",
      titleBn: e.titleBn,
      titleEn: e.titleEn,
      summaryBn: e.detailBn,
      summaryEn: e.detailEn,
      relatedWords: [],
      relatedSlugs: [],
      source: "Alapon editorial"
    });
  }

  // Links work both ways: if A lists B as related, B lists A too.
  const bySlug = new Map(all.map((d) => [d.slug, { ...d, relatedSlugs: [...d.relatedSlugs] }]));
  for (const d of all) {
    for (const other of d.relatedSlugs) {
      const target = bySlug.get(other);
      if (target && !target.relatedSlugs.includes(d.slug)) target.relatedSlugs.push(d.slug);
    }
  }
  return [...bySlug.values()];
}

export function getAllDiscoveries(): Discovery[] {
  cache ??= build();
  return cache;
}

export function getDiscovery(slug: string): Discovery | undefined {
  return getAllDiscoveries().find((d) => d.slug === slug);
}

export function getDiscoveriesByCategory(category: DiscoveryCategory): Discovery[] {
  return getAllDiscoveries().filter((d) => d.category === category);
}

export function getRelatedDiscoveries(discovery: Discovery): Discovery[] {
  return discovery.relatedSlugs.map((slug) => getDiscovery(slug)).filter((d): d is Discovery => Boolean(d));
}

/** One authored discovery (place, food, literature, song, history) per day, the same for everyone. */
export function getDailyDiscovery(date: Date): Discovery {
  const authored = getAllDiscoveries().filter((d) => DISCOVERIES.some((a) => a.slug === d.slug));
  const day = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2026, 0, 1)) / 86_400_000
  );
  return authored[((day % authored.length) + authored.length) % authored.length];
}
