/**
 * Unicode character classification tables for the Bengali script (U+0980-U+09FF).
 *
 * These are the load-bearing tables for normalize.ts and tokenize.ts. Reference:
 * https://www.unicode.org/charts/PDF/U0980.pdf
 */

export const INDEPENDENT_VOWELS = new Set<number>([
  0x0985, 0x0986, 0x0987, 0x0988, 0x0989, 0x098a, 0x098b, 0x098c, 0x098f, 0x0990, 0x0993, 0x0994, 0x09e0,
  0x09e1
]);

export const CONSONANTS = new Set<number>([
  0x0995,
  0x0996,
  0x0997,
  0x0998,
  0x0999, // ক খ গ ঘ ঙ
  0x099a,
  0x099b,
  0x099c,
  0x099d,
  0x099e, // চ ছ জ ঝ ঞ
  0x099f,
  0x09a0,
  0x09a1,
  0x09a2,
  0x09a3, // ট ঠ ড ঢ ণ
  0x09a4,
  0x09a5,
  0x09a6,
  0x09a7,
  0x09a8, // ত থ দ ধ ন
  0x09aa,
  0x09ab,
  0x09ac,
  0x09ad,
  0x09ae, // প ফ ব ভ ম
  0x09af,
  0x09b0,
  0x09b2, // য র ল
  0x09b6,
  0x09b7,
  0x09b8,
  0x09b9, // শ ষ স হ
  0x09dc,
  0x09dd,
  0x09df, // ড় ঢ় য় (nukta-consonants, often precomposed)
  0x09ce // ৎ khanda ta
]);

/** Dependent vowel signs (matra) - always attach to the preceding consonant/vowel. */
export const VOWEL_SIGNS = new Set<number>([
  0x09be, 0x09bf, 0x09c0, 0x09c1, 0x09c2, 0x09c3, 0x09c4, 0x09c7, 0x09c8, 0x09cb, 0x09cc, 0x09d7, 0x09e2,
  0x09e3
]);

export const VIRAMA = 0x09cd; // hasant, joins consonants into a conjunct
export const NUKTA = 0x09bc; // combining nukta (rare in decomposed form)
export const CANDRABINDU = 0x0981;
export const ANUSVARA = 0x0982;
export const VISARGA = 0x0983;
export const ZWJ = 0x200d;
export const ZWNJ = 0x200c;

export const DIGITS = new Set<number>([
  0x09e6, 0x09e7, 0x09e8, 0x09e9, 0x09ea, 0x09eb, 0x09ec, 0x09ed, 0x09ee, 0x09ef
]);

/** Trailing modifiers that can follow a base+matra but never start a new akshara. */
export const TRAILING_MODIFIERS = new Set<number>([CANDRABINDU, ANUSVARA, VISARGA]);

export const BENGALI_DANDA = 0x0964; // ।
export const BENGALI_DOUBLE_DANDA = 0x0965; // ॥

export type CharClass =
  | "independent_vowel"
  | "consonant"
  | "vowel_sign"
  | "virama"
  | "nukta"
  | "trailing_modifier"
  | "joiner"
  | "digit"
  | "other";

export function classify(codePoint: number): CharClass {
  if (INDEPENDENT_VOWELS.has(codePoint)) return "independent_vowel";
  if (CONSONANTS.has(codePoint)) return "consonant";
  if (VOWEL_SIGNS.has(codePoint)) return "vowel_sign";
  if (codePoint === VIRAMA) return "virama";
  if (codePoint === NUKTA) return "nukta";
  if (TRAILING_MODIFIERS.has(codePoint)) return "trailing_modifier";
  if (codePoint === ZWJ || codePoint === ZWNJ) return "joiner";
  if (DIGITS.has(codePoint)) return "digit";
  return "other";
}

export function isBengaliCodePoint(codePoint: number): boolean {
  return codePoint >= 0x0980 && codePoint <= 0x09ff;
}
