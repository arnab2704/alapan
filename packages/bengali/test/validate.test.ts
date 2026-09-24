import { describe, expect, it } from "vitest";
import { isValidBengaliWord } from "../src/validate";

describe("isValidBengaliWord", () => {
  it("accepts an ordinary word", () => {
    expect(isValidBengaliWord("বাংলা")).toBe(true);
  });

  it("accepts a word containing a conjunct", () => {
    expect(isValidBengaliWord("ক্ষমা")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidBengaliWord("")).toBe(false);
  });

  it("rejects an orphan vowel sign with no base consonant", () => {
    expect(isValidBengaliWord("িক")).toBe(false);
  });

  it("rejects a dangling virama", () => {
    expect(isValidBengaliWord("ক্")).toBe(false);
  });

  it("rejects text containing punctuation", () => {
    expect(isValidBengaliWord("বাংলা।")).toBe(false);
  });

  it("rejects a pure digit string", () => {
    expect(isValidBengaliWord("১২৩")).toBe(false);
  });
});
