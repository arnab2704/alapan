const KEY = "alapon.puja.passport.v1";

/** ISO dates of stamped Puja days, per festival slug. */
export function readPassport(slug: string): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const stamps = parsed[slug];
    return Array.isArray(stamps) ? stamps.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function stampPassport(slug: string, isoDate: string): string[] {
  const next = Array.from(new Set([...readPassport(slug), isoDate]));
  try {
    const raw = window.localStorage.getItem(KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    window.localStorage.setItem(KEY, JSON.stringify({ ...all, [slug]: next }));
  } catch {
    // Storage unavailable: the stamp lasts for this visit only.
  }
  return next;
}
