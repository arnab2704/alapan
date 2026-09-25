import { normalizeBengali } from "@alapon/bengali";

/** URL segment for a word's page: the normalised word itself, percent-encoded. */
export function wordSlug(word: string): string {
  return encodeURIComponent(normalizeBengali(word));
}

export function wordFromSlug(slug: string): string {
  try {
    return normalizeBengali(decodeURIComponent(slug));
  } catch {
    return "";
  }
}

export function wordHref(word: string, from?: "game"): string {
  return `/word/${wordSlug(word)}${from ? `?from=${from}` : ""}`;
}
