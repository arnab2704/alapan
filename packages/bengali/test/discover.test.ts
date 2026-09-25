import { describe, expect, it } from "vitest";
import {
  DISCOVERY_CATEGORIES,
  getAllDiscoveries,
  getDailyDiscovery,
  getDiscovery,
  getRelatedDiscoveries,
  getWordEntry
} from "../src";

describe("discoveries", () => {
  const all = getAllDiscoveries();

  it("has unique slugs and every category is represented", () => {
    const slugs = all.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const category of DISCOVERY_CATEGORIES) {
      expect(
        all.some((d) => d.category === category),
        category
      ).toBe(true);
    }
    expect(all.length).toBeGreaterThanOrEqual(60);
  });

  it("gives every discovery bilingual text and a source", () => {
    for (const d of all) {
      expect(d.titleBn.length, d.slug).toBeGreaterThan(1);
      expect(d.titleEn.length, d.slug).toBeGreaterThan(1);
      expect(d.summaryBn.length, d.slug).toBeGreaterThan(15);
      expect(d.summaryEn.length, d.slug).toBeGreaterThan(15);
      expect(d.source.length, d.slug).toBeGreaterThan(2);
    }
  });

  it("only links to discoveries and words that exist", () => {
    for (const d of all) {
      for (const slug of d.relatedSlugs) expect(getDiscovery(slug), `${d.slug} -> ${slug}`).toBeDefined();
      for (const word of d.relatedWords) expect(getWordEntry(word), `${d.slug} -> ${word}`).not.toBeNull();
    }
  });

  it("links both ways", () => {
    for (const d of all) {
      for (const other of getRelatedDiscoveries(d)) {
        expect(other.relatedSlugs, `${other.slug} should link back to ${d.slug}`).toContain(d.slug);
      }
    }
  });

  it("picks a stable discovery of the day", () => {
    expect(getDailyDiscovery(new Date(2026, 8, 24, 1))).toEqual(getDailyDiscovery(new Date(2026, 8, 24, 23)));
    expect(getDailyDiscovery(new Date(2026, 8, 25)).slug).not.toBe(
      getDailyDiscovery(new Date(2026, 8, 24)).slug
    );
  });
});
