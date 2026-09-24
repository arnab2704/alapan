import { normalizeBengali } from "./normalize";
import { classify } from "./constants";

export type TokenType = "akshara" | "digit" | "other";

export interface BengaliToken {
  /** The rendered text of this token, e.g. "ক্ষ", "না", "৭", " " */
  text: string;
  type: TokenType;
  /** false when the token contains an orphan vowel sign / dangling virama. */
  wellFormed: boolean;
}

/**
 * Segments text into game/orthographic tokens ("akshara"): a consonant
 * cluster joined by virama (conjuncts like ক্ষ, ন্ত্র, স্ব) plus an optional
 * dependent vowel sign and trailing modifiers, treated as a single unit.
 *
 * This is deliberately independent of grapheme-cluster segmentation
 * (graphemes.ts): ICU's conjunct-merging behavior for Indic scripts varies
 * by version, and ShobdoShakti needs deterministic, explicit tile
 * boundaries regardless of runtime. Digits and punctuation/whitespace are
 * emitted as their own token types so callers can filter by `type`.
 */
export function tokenizeBengali(text: string): BengaliToken[] {
  const normalized = normalizeBengali(text);
  const chars = Array.from(normalized);
  const tokens: BengaliToken[] = [];

  let current = "";
  let currentType: TokenType | null = null;
  let currentWellFormed = true;
  let pendingVirama = false;

  const flush = () => {
    if (current !== "") {
      tokens.push({ text: current, type: currentType ?? "other", wellFormed: currentWellFormed });
    }
    current = "";
    currentType = null;
    currentWellFormed = true;
    pendingVirama = false;
  };

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const cls = classify(ch.codePointAt(0)!);

    switch (cls) {
      case "consonant":
      case "independent_vowel": {
        if (pendingVirama && currentType === "akshara") {
          // Joins the open conjunct, e.g. ক + ্ + ষ -> ক্ষ
          current += ch;
          pendingVirama = false;
        } else {
          flush();
          current = ch;
          currentType = "akshara";
        }
        break;
      }
      case "vowel_sign": {
        if (currentType === "akshara") {
          current += ch;
        } else {
          // Orphan matra with no base - keep it visible but flag invalid.
          flush();
          current = ch;
          currentType = "akshara";
          currentWellFormed = false;
        }
        pendingVirama = false;
        break;
      }
      case "virama": {
        if (currentType === "akshara") {
          current += ch;
          pendingVirama = true;
        } else {
          flush();
          current = ch;
          currentType = "akshara";
          currentWellFormed = false;
          pendingVirama = true;
        }
        break;
      }
      case "nukta": {
        if (currentType === "akshara") {
          current += ch;
        } else {
          flush();
          current = ch;
          currentType = "akshara";
          currentWellFormed = false;
        }
        pendingVirama = false;
        break;
      }
      case "trailing_modifier": {
        if (currentType === "akshara") {
          current += ch;
        } else {
          flush();
          current = ch;
          currentType = "akshara";
          currentWellFormed = false;
        }
        pendingVirama = false;
        flush();
        break;
      }
      case "joiner": {
        // Only meaningful mid-conjunct (right after a virama); otherwise ignore.
        if (pendingVirama && currentType === "akshara") {
          current += ch;
        }
        break;
      }
      case "digit": {
        if (currentType === "digit") {
          current += ch;
        } else {
          flush();
          current = ch;
          currentType = "digit";
        }
        break;
      }
      case "other":
      default: {
        flush();
        tokens.push({ text: ch, type: "other", wellFormed: true });
        break;
      }
    }
  }

  // A trailing virama with nothing to join means the conjunct never closed.
  if (pendingVirama) currentWellFormed = false;
  flush();

  return tokens;
}

/** Convenience: just the akshara/digit tile text, dropping whitespace and punctuation. */
export function tokenizeToTiles(text: string): string[] {
  return tokenizeBengali(text)
    .filter((t) => t.type !== "other")
    .map((t) => t.text);
}
