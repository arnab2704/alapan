import { ZWJ, ZWNJ, VIRAMA, classify } from "./constants";

/**
 * Canonical NFC normalization plus whitespace cleanup. This is the baseline
 * every other normalize* function builds on. NFC composes decomposed vowel
 * signs (e.g. 09C7 09BE -> 09CB) since Bengali defines canonical
 * decompositions for the two-part vowel signs.
 *
 * ZWJ/ZWNJ are only meaningful immediately after a virama (they steer which
 * glyph a conjunct/reph renders as); anywhere else they are noise from
 * copy-paste and are stripped.
 */
export function normalizeBengali(text: string): string {
  const nfc = text.normalize("NFC");
  const codePoints = Array.from(nfc);
  const out: string[] = [];

  for (let i = 0; i < codePoints.length; i++) {
    const ch = codePoints[i];
    const cp = ch.codePointAt(0)!;
    if (cp === ZWJ || cp === ZWNJ) {
      const prevCp = i > 0 ? codePoints[i - 1].codePointAt(0)! : -1;
      if (prevCp === VIRAMA) {
        out.push(ch);
      }
      continue;
    }
    out.push(ch);
  }

  return out.join("").replace(/\s+/g, " ").trim();
}

/**
 * Loose form used for search matching: strips joiners entirely and drops
 * optional nasalisation/aspiration marks that users frequently omit when
 * typing, so "চাঁদ" and "চাদ" can still match.
 */
export function normalizeForSearch(text: string): string {
  const base = normalizeBengali(text);
  return Array.from(base)
    .filter((ch) => {
      const cls = classify(ch.codePointAt(0)!);
      return cls !== "joiner" && cls !== "trailing_modifier";
    })
    .join("")
    .toLowerCase();
}

/**
 * Strict canonical form used as the dedup/storage key for dictionary_words.
 * Two different Unicode encodings of the same word must normalize to the
 * same normalized_word.
 */
export function normalizeForDictionary(text: string): string {
  const base = normalizeBengali(text);
  return Array.from(base)
    .filter((ch) => classify(ch.codePointAt(0)!) !== "joiner")
    .join("")
    .trim();
}
