import { describe, expect, it } from "vitest";
import { canFormWordFromLetters, checkWordJaalGuess, scoreWordJaalWord } from "../src/wordJaal";
import type { WordJaalCombination } from "../src/wordJaalLevels";

const combo: WordJaalCombination = {
  letters: ["ক", "ল", "ম"],
  canForm: ["কলম", "কল", "মল", "কম"]
};

describe("canFormWordFromLetters", () => {
  it("accepts a word whose characters are all within the letter multiset", () => {
    expect(canFormWordFromLetters("কলম", ["ক", "ল", "ম"])).toBe(true);
  });

  it("rejects a word needing a character not present at all", () => {
    expect(canFormWordFromLetters("কাল", ["ক", "ল", "ম"])).toBe(false); // needs আ-kar, not available
  });

  it("rejects a word needing more copies of a character than available", () => {
    expect(canFormWordFromLetters("কাকা", ["ক", "া"])).toBe(false); // needs ক x2, া x2
    expect(canFormWordFromLetters("কাকা", ["ক", "ক", "া", "া"])).toBe(true);
  });
});

describe("scoreWordJaalWord", () => {
  it("sums per-character points and excludes virama", () => {
    // ক=1, ল=2, ম=2 (see WORDJAAL_TILE_SCORES)
    expect(scoreWordJaalWord("কলম")).toBe(5);
  });
});

describe("checkWordJaalGuess", () => {
  it("returns 'empty' for a blank guess", () => {
    const result = checkWordJaalGuess(combo, "", []);
    expect(result.outcome).toBe("empty");
  });

  it("returns 'already_found' for a word already in the found list", () => {
    const result = checkWordJaalGuess(combo, "কল", ["কল"]);
    expect(result.outcome).toBe("already_found");
  });

  it("returns 'not_in_list' for a word not in canForm", () => {
    const result = checkWordJaalGuess(combo, "মক", []);
    expect(result.outcome).toBe("not_in_list");
  });

  it("returns 'correct' with points for a valid, not-yet-found word", () => {
    const result = checkWordJaalGuess(combo, "কল", []);
    expect(result.outcome).toBe("correct");
    expect(result.points).toBeGreaterThan(0);
  });

  it("awards the full-rack bonus when the word uses every letter in the combination", () => {
    const withBonus = checkWordJaalGuess(combo, "কলম", []); // 3 letters = combo.letters.length
    const withoutBonus = checkWordJaalGuess(combo, "কল", []); // 2 letters < combo.letters.length
    expect(withBonus.usedFullRack).toBe(true);
    expect(withoutBonus.usedFullRack).toBe(false);
    expect(withBonus.points).toBeGreaterThan(withoutBonus.points);
  });

  it("awards zero points for a helped (revealed) word even if correct", () => {
    const result = checkWordJaalGuess(combo, "কলম", [], { isHelped: true });
    expect(result.outcome).toBe("correct");
    expect(result.points).toBe(0);
  });

  it("normalizes the guess before comparing (NFC-equivalent encodings match)", () => {
    // "কো" as a decomposed sequence (ক + ে + া) must still match the precomposed canForm entry.
    const decomposedGuess = "ক" + "ে" + "া";
    const oCombo: WordJaalCombination = { letters: ["ক", "ো"], canForm: ["কো"] };
    const result = checkWordJaalGuess(oCombo, decomposedGuess, []);
    expect(result.outcome).toBe("correct");
  });
});
