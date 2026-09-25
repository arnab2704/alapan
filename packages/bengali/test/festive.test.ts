import { describe, expect, it } from "vitest";
import { getAddaPrompt, getAllDailyWords, getDailyWord, getWordEntry } from "../src/index";
import { FESTIVE_ADDA_PROMPTS, FESTIVE_DAILY_WORDS } from "../src/data/festive-daily";
import { PUJA_ROWS } from "../src/data/word-bank-puja";

import { FESTIVE_ADDA_PROMPTS_2, FESTIVE_DAILY_WORDS_2 } from "../src/data/festive-daily-2";
import { getAllWordEntries } from "../src/index";
import { KARTIK_ROWS } from "../src/data/word-bank-kartik";

describe("Post-Puja festival content", () => {
  it("dates the words for Lakshmi Puja, Kali Puja, Bhai Phota and Jagaddhatri, all in the word bank", () => {
    expect(getDailyWord(new Date(2026, 9, 25)).word).toBe("কোজাগরী");
    expect(getDailyWord(new Date(2026, 10, 10)).word).toBe("ভাইফোঁটা");
    expect(getDailyWord(new Date(2026, 10, 17)).word).toBe("জগদ্ধাত্রী");
    for (const word of Object.values(FESTIVE_DAILY_WORDS_2)) {
      expect(getWordEntry(word.word), word.word).not.toBeNull();
    }
    expect(KARTIK_ROWS.length).toBe(13);
  });

  it("has a prompt for every day from 30 Oct to 17 Nov and no duplicate words in the bank", () => {
    expect(Object.keys(FESTIVE_ADDA_PROMPTS_2)).toHaveLength(19);
    expect(getAddaPrompt(new Date(2026, 10, 17)).bn).toBeTruthy();
    const words = getAllWordEntries().map((w) => w.word);
    const dupes = words.filter((w, i) => words.indexOf(w) !== i);
    expect(dupes).toEqual([]);
  });
});

describe("Sharodiya content", () => {
  it("targets the daily word to the Puja days and every festive word has a Word DNA entry", () => {
    expect(getDailyWord(new Date(2026, 9, 17)).word).toBe("বোধন");
    expect(getDailyWord(new Date(2026, 9, 21)).word).toBe("বিসর্জন");
    for (const word of Object.values(FESTIVE_DAILY_WORDS)) {
      expect(getWordEntry(word.word), `${word.word} missing from the word bank`).not.toBeNull();
    }
  });

  it("has twenty Puja words with an example and the rotating pool is untouched", () => {
    expect(PUJA_ROWS).toHaveLength(20);
    expect(new Set(PUJA_ROWS.map((r) => r[0])).size).toBe(20);
    expect(getAllDailyWords().length).toBe(28);
  });

  it("gives one Adda prompt for every day from 10 to 29 October", () => {
    expect(Object.keys(FESTIVE_ADDA_PROMPTS)).toHaveLength(20);
    expect(getAddaPrompt(new Date(2026, 9, 10)).bn).toContain("মহালয়া");
    expect(getAddaPrompt(new Date(2026, 9, 29)).bn).toContain("কালীপুজো");
  });
});
