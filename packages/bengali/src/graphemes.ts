import { normalizeBengali } from "./normalize";
import { classify } from "./constants";

/**
 * Extended grapheme clusters, for cursor movement / text-editing / substring
 * truncation. Never use `text.length` or `[...text]` directly on Bengali
 * strings for "how many letters" - a vowel sign must never be separated
 * from its base consonant.
 *
 * Uses Intl.Segmenter when available (Node 18+, evergreen browsers), with a
 * manual fallback so the package degrades gracefully rather than throwing.
 */
export function graphemes(text: string): string[] {
  const normalized = normalizeBengali(text);

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("bn", { granularity: "grapheme" });
    return Array.from(segmenter.segment(normalized), (s) => s.segment);
  }

  return fallbackGraphemes(normalized);
}

/**
 * Manual fallback: base character (consonant/vowel/digit/other) followed by
 * any run of combining marks (vowel signs, virama, nukta, trailing
 * modifiers, joiners). Does not merge conjuncts - that is tokenizeBengali's
 * job, deliberately kept separate from grapheme-cluster semantics.
 */
function fallbackGraphemes(text: string): string[] {
  const chars = Array.from(text);
  const clusters: string[] = [];
  let current = "";

  for (const ch of chars) {
    const cls = classify(ch.codePointAt(0)!);
    const isCombining =
      cls === "vowel_sign" ||
      cls === "virama" ||
      cls === "nukta" ||
      cls === "trailing_modifier" ||
      cls === "joiner";

    if (isCombining && current !== "") {
      current += ch;
    } else {
      if (current !== "") clusters.push(current);
      current = ch;
    }
  }
  if (current !== "") clusters.push(current);
  return clusters;
}
