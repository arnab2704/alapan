import { getAllDiscoveries, getAllFestivals, getAllWordEntries, normalizeForSearch } from "@alapon/bengali";
import { wordHref } from "@/lib/wordLinks";
import { getAllLearnLessons } from "@alapon/game-engine";

export type SearchKind = "word" | "lesson" | "festival" | "person" | "place" | "story";

export interface SearchEntry {
  id: string;
  kind: SearchKind;
  /** Localised-independent Bengali title. */
  titleBn: string;
  titleEn: string;
  /** Extra text that should match (pronunciation, meanings). */
  haystack: string;
  /** Path after the locale prefix. */
  href: string;
}

let cache: SearchEntry[] | null = null;

const norm = (text: string) => normalizeForSearch(text).toLowerCase();

/**
 * Everything the site-wide search can find. Later content types (the word bank, discoveries)
 * are added here so search stays a single place to extend.
 */
export function getSearchIndex(): SearchEntry[] {
  if (cache) return cache;
  const entries: SearchEntry[] = [];

  for (const entry of getAllWordEntries()) {
    entries.push({
      id: `word-${entry.word}`,
      kind: "word",
      titleBn: entry.word,
      titleEn: entry.meaningEn,
      haystack: norm(`${entry.word} ${entry.pronunciation} ${entry.meaningBn} ${entry.meaningEn}`),
      href: wordHref(entry.word)
    });
  }

  for (const { lesson } of getAllLearnLessons()) {
    entries.push({
      id: `lesson-${lesson.id}`,
      kind: "lesson",
      titleBn: lesson.titleBn,
      titleEn: lesson.titleEn,
      haystack: norm(
        `${lesson.titleBn} ${lesson.titleEn} ${lesson.items.map((i) => `${i.bn} ${i.roman} ${i.en ?? ""}`).join(" ")}`
      ),
      href: `/learn/${lesson.id}`
    });
  }

  for (const festival of getAllFestivals()) {
    entries.push({
      id: `festival-${festival.slug}`,
      kind: "festival",
      titleBn: festival.nameBn,
      titleEn: festival.nameEn,
      haystack: norm(
        `${festival.nameBn} ${festival.nameEn} ${festival.descriptionBn} ${festival.descriptionEn}`
      ),
      href: `/festival/${festival.slug}`
    });
  }

  for (const d of getAllDiscoveries()) {
    entries.push({
      id: `discovery-${d.slug}`,
      kind: d.category === "person" ? "person" : d.category === "place" ? "place" : "story",
      titleBn: d.titleBn,
      titleEn: d.titleEn,
      haystack: norm(`${d.titleBn} ${d.titleEn} ${d.summaryBn} ${d.summaryEn}`),
      href: `/discover/${d.slug}`
    });
  }

  cache = entries;
  return entries;
}

/** Bengali-aware search: normalises both sides, every query word must match, title matches rank first. */
export function searchIndex(query: string, limit = 40): SearchEntry[] {
  const q = norm(query).trim();
  if (q.length === 0) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored: Array<{ entry: SearchEntry; score: number }> = [];
  for (const entry of getSearchIndex()) {
    if (!terms.every((term) => entry.haystack.includes(term))) continue;
    const title = norm(`${entry.titleBn} ${entry.titleEn}`);
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 2 : 1), 0);
    scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}
