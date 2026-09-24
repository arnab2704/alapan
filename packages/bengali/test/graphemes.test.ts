import { describe, expect, it } from "vitest";
import { graphemes } from "../src/graphemes";

describe("graphemes", () => {
  it("keeps a consonant and its vowel sign as a single cluster", () => {
    expect(graphemes("কি")).toEqual(["কি"]);
  });

  it("never separates a matra into its own cluster", () => {
    const clusters = graphemes("বাংলা");
    for (const cluster of clusters) {
      expect(cluster).not.toBe("া");
      expect(cluster).not.toBe("ি");
    }
  });

  it("treats plain independent vowels as their own clusters", () => {
    expect(graphemes("অআই")).toEqual(["অ", "আ", "ই"]);
  });
});
