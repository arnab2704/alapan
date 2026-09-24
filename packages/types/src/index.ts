export type Locale = "bn" | "en";

/**
 * Provenance classification for any imported dictionary/cultural asset.
 * UNKNOWN must never be imported into production (see docs/architecture).
 */
export type LicenseStatus =
  | "PUBLIC_DOMAIN"
  | "OPEN_LICENSE"
  | "CREATIVE_COMMONS"
  | "COMMERCIAL_LICENSE"
  | "USER_SUBMITTED"
  | "INTERNAL"
  | "UNKNOWN";

export type PartOfSpeech =
  | "noun"
  | "pronoun"
  | "verb"
  | "adjective"
  | "adverb"
  | "postposition"
  | "conjunction"
  | "interjection"
  | "unknown";

export interface ContentSource {
  id: string;
  sourceName: string;
  sourceUrl?: string;
  license: LicenseStatus;
  rightsStatus: string;
  retrievedAt: string;
  notes?: string;
}

export interface DictionaryWord {
  id: string;
  word: string;
  normalizedWord: string;
  meaningBn?: string;
  meaningEn?: string;
  pronunciation?: string;
  partOfSpeech: PartOfSpeech;
  difficulty: 1 | 2 | 3 | 4 | 5;
  frequency: number;
  validForGame: boolean;
  sourceId: string;
  license: LicenseStatus;
  confidence: number;
}

export type GameSlug = "shobdoshakti";

export interface GameDefinition {
  id: string;
  slug: GameSlug;
  nameBn: string;
  nameEn: string;
  type: "word-board";
  status: "active" | "draft" | "disabled";
}

export interface GameSessionResult {
  gameId: string;
  score: number;
  durationMs: number;
  metadata?: Record<string, unknown>;
}
