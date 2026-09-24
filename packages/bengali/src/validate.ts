import { tokenizeBengali } from "./tokenize";
import { classify } from "./constants";

/**
 * Structural validity check: not a dictionary lookup, just "is this a
 * well-formed sequence of Bengali orthographic units" (no orphan matra, no
 * dangling virama, contains at least one letter). Dictionary membership is
 * a separate concern (see game-engine's dictionaryLookup).
 */
export function isValidBengaliWord(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed === "") return false;

  const tokens = tokenizeBengali(trimmed);
  if (tokens.length === 0) return false;
  if (tokens.some((t) => t.type === "other")) return false;
  if (tokens.some((t) => !t.wellFormed)) return false;

  const hasLetter = tokens.some((t) => {
    const first = Array.from(t.text)[0];
    const cls = classify(first.codePointAt(0)!);
    return cls === "consonant" || cls === "independent_vowel";
  });

  return hasLetter;
}
