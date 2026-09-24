import { describe, expect, it } from "vitest";
import { normalizeBengali, normalizeForDictionary, normalizeForSearch } from "../src/normalize";

describe("normalizeBengali", () => {
  it("composes decomposed two-part vowel signs into their precomposed form", () => {
    const decomposed = "ক" + "ে" + "া"; // ক + ে + া
    const precomposed = "ক" + "ো"; // ক + ো
    expect(normalizeBengali(decomposed)).toBe(precomposed);
  });

  it("collapses and trims whitespace", () => {
    expect(normalizeBengali("  বাংলা   ভাষা  ")).toBe("বাংলা ভাষা");
  });

  it("strips a ZWJ that does not follow a virama", () => {
    const withStrayZwj = "বাং" + "‍" + "লা";
    expect(normalizeBengali(withStrayZwj)).toBe("বাংলা");
  });

  it("keeps a ZWJ immediately after a virama (controls conjunct glyph choice)", () => {
    const withMeaningfulZwj = "ক" + "্" + "‍" + "ষ";
    expect(normalizeBengali(withMeaningfulZwj)).toContain("‍");
  });
});

describe("normalizeForDictionary", () => {
  it("produces the same key for two different valid encodings of one word", () => {
    const a = normalizeForDictionary("ক" + "ে" + "া" + "না"); // decomposed ো
    const b = normalizeForDictionary("কোনা");
    expect(a).toBe(b);
  });
});

describe("normalizeForSearch", () => {
  it("is lenient about optional nasalisation marks", () => {
    expect(normalizeForSearch("চাঁদ")).not.toContain("ঁ");
  });
});
