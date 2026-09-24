const GREGORIAN_MONTHS_BN = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর"
];

const GREGORIAN_MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

/** Parses an ISO yyyy-mm-dd as a local date, avoiding the UTC-midnight parsing `new Date(iso)` does. */
function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a Date's LOCAL calendar day as yyyy-mm-dd. Deliberately not
 * `date.toISOString().slice(0, 10)`, which reads the UTC day and silently
 * shifts by one near midnight in timezones behind UTC.
 */
export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Formats a festival's Gregorian date for display, e.g. "১৭ অক্টোবর, ২০২৬" (bn) or "17 October 2026" (en). */
export function formatGregorianDate(
  iso: string,
  locale: "bn" | "en",
  toDigits: (n: number) => string
): string {
  const date = parseIsoDate(iso);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  if (locale === "bn") {
    return `${toDigits(day)} ${GREGORIAN_MONTHS_BN[month]}, ${toDigits(year)}`;
  }
  return `${day} ${GREGORIAN_MONTHS_EN[month]} ${year}`;
}

/**
 * Formats a festival's date range for display. Collapses to a single
 * "day-day month, year" line when both ends share a month, e.g.
 * "১৭-২১ অক্টোবর, ২০২৬"; otherwise formats each end in full.
 */
export function formatGregorianRange(
  startIso: string,
  endIso: string,
  locale: "bn" | "en",
  toDigits: (n: number) => string
): string {
  if (startIso === endIso) return formatGregorianDate(startIso, locale, toDigits);

  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();

  if (!sameMonth) {
    return `${formatGregorianDate(startIso, locale, toDigits)} - ${formatGregorianDate(endIso, locale, toDigits)}`;
  }
  const monthName =
    locale === "bn" ? GREGORIAN_MONTHS_BN[start.getMonth()] : GREGORIAN_MONTHS_EN[start.getMonth()];
  const days = `${toDigits(start.getDate())}-${toDigits(end.getDate())}`;
  return locale === "bn"
    ? `${days} ${monthName}, ${toDigits(start.getFullYear())}`
    : `${days} ${monthName} ${start.getFullYear()}`;
}
