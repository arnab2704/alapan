export const SAVED_WORDS_EVENT = "alapon:saved-words";
const KEY = "alapon.words.saved.v1";

export interface SavedWord {
  word: string;
  savedAt: string;
}

export function readSavedWords(): SavedWord[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (v): v is SavedWord =>
            typeof v === "object" && v !== null && typeof (v as SavedWord).word === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function write(words: SavedWord[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(words.slice(-1000)));
  } catch {
    // storage unavailable
  }
  window.dispatchEvent(new Event(SAVED_WORDS_EVENT));
}

export function isWordSaved(word: string): boolean {
  return readSavedWords().some((w) => w.word === word);
}

export function saveWord(word: string): void {
  if (isWordSaved(word)) return;
  write([...readSavedWords(), { word, savedAt: new Date().toISOString() }]);
}

export function unsaveWord(word: string): void {
  write(readSavedWords().filter((w) => w.word !== word));
}
