import { describe, expect, it } from "vitest";
import { estimateDifficulty, getAllWordEntries, getWordDNA, getWordEntry, normalizeBengali } from "../src";

describe("word bank integrity", () => {
  const entries = getAllWordEntries();

  it("has no duplicate words and every word is already normalised", () => {
    const words = entries.map((e) => e.word);
    expect(new Set(words).size).toBe(words.length);
    for (const e of entries) expect(e.word).toBe(normalizeBengali(e.word));
  });

  it("gives every entry a meaning, an example, a pronunciation and a valid difficulty", () => {
    for (const e of entries) {
      expect(e.meaningBn.length, e.word).toBeGreaterThan(2);
      expect(e.meaningEn.length, e.word).toBeGreaterThan(1);
      expect(e.pronunciation.length, e.word).toBeGreaterThan(0);
      expect(e.exampleBn.length, e.word).toBeGreaterThan(2);
      expect([1, 2, 3, 4, 5]).toContain(e.difficulty);
    }
  });

  it("has a substantial curated bank with cultural notes on many words", () => {
    expect(entries.length).toBeGreaterThanOrEqual(90);
    expect(entries.filter((e) => e.culturalNote).length).toBeGreaterThanOrEqual(25);
  });

  it("keeps every note bilingual", () => {
    for (const e of entries) {
      if (e.culturalNote) {
        expect(e.culturalNote.bn.length).toBeGreaterThan(5);
        expect(e.culturalNote.en.length).toBeGreaterThan(5);
      }
    }
  });
});

describe("getWordDNA", () => {
  it("returns a full entry for a curated word", () => {
    const dna = getWordDNA("নদী");
    expect(dna.entry?.meaningEn).toBe("a river");
    expect(dna.tiles.join("")).toBe("নদী");
    expect(dna.relatedWithEntries).toContain("জল");
  });

  it("still works for a word without an entry", () => {
    const dna = getWordDNA("তভ");
    expect(dna.entry).toBeNull();
    expect(dna.tiles.length).toBeGreaterThan(0);
    expect(dna.difficulty).toBeGreaterThanOrEqual(1);
  });

  it("finds daily words that pre-date the bank, and prefers the bank when both exist", () => {
    expect(getWordEntry("আড্ডা")?.category).toBe("society");
    expect(getWordEntry("গল্প")?.culturalNote).toBeTruthy();
  });

  it("estimates harder for longer, conjunct-heavy words", () => {
    expect(estimateDifficulty("জল")).toBeLessThan(estimateDifficulty("সংস্কৃতি"));
    expect(estimateDifficulty("স্বাধীনতা")).toBeGreaterThanOrEqual(4);
  });

  it("normalises equivalent spellings to the same entry", () => {
    expect(getWordDNA("  নদী ").word).toBe("নদী");
  });
});

describe("the Learn course vocabulary", () => {
  it("is fully covered by curated word entries", async () => {
    // Every vocabulary word taught in the course can be opened as a full Word DNA.
    const { LEARN_UNITS } = await import("../../game-engine/src/data/learn-curriculum");
    const words = LEARN_UNITS.find((u) => u.id === "words")!.lessons.flatMap((l) => l.items.map((i) => i.bn));
    const missing = words.filter((w) => getWordEntry(w) === null);
    expect(missing).toEqual([]);
  });
});
