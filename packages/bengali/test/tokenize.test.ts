import { describe, expect, it } from "vitest";
import { tokenizeBengali, tokenizeToTiles } from "../src/tokenize";

describe("tokenizeBengali", () => {
  it("merges a conjunct (ক্ষ) into a single akshara token, distinct from its next syllable", () => {
    // ক্ষমা (kshama) = ক্ষ + মা
    expect(tokenizeToTiles("ক্ষমা")).toEqual(["ক্ষ", "মা"]);
  });

  it("merges a three-consonant conjunct as one token", () => {
    // দ্যা from বিদ্যা (bidya)
    expect(tokenizeToTiles("বিদ্যা")).toEqual(["বি", "দ্যা"]);
  });

  it("attaches trailing anusvara to the akshara it modifies", () => {
    expect(tokenizeToTiles("বাংলা")).toEqual(["বাং", "লা"]);
  });

  it("keeps whitespace and punctuation as separate 'other' tokens", () => {
    const tokens = tokenizeBengali("মা, বাবা।");
    expect(tokens.some((t) => t.type === "other" && t.text === "।")).toBe(true);
  });

  it("groups consecutive digits into one digit token", () => {
    const tokens = tokenizeBengali("১২৩");
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe("digit");
    expect(tokens[0].text).toBe("১২৩");
  });

  it("flags an orphan vowel sign as not well-formed", () => {
    const tokens = tokenizeBengali("িক");
    expect(tokens[0].wellFormed).toBe(false);
  });

  it("flags a dangling virama at end of word as not well-formed", () => {
    const tokens = tokenizeBengali("ক্");
    expect(tokens[tokens.length - 1].wellFormed).toBe(false);
  });
});
