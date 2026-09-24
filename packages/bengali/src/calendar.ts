/**
 * Gregorian <-> Bengali (Bangabda) solar calendar conversion.
 *
 * The Bengali calendar's real-world civil convention varies slightly by
 * region and by year (Poila Boishakh has fallen on 14 or 15 April in
 * different recent years, tied to precession-driven sankranti timing that
 * doesn't reduce to a simple fixed rule). Rather than approximate
 * astronomical sankranti timing, this module fixes a single deterministic
 * convention for the current era - Poila Boishakh (Boishakh 1) always
 * falls on 15 April - matching the West Bengal civil calendar for the
 * years this app cares about. This is a documented simplification, not a
 * claim of panjika-exact tithi precision; see festivals.ts for the same
 * honesty applied to lunisolar festival dates.
 */

export interface BengaliMonthInfo {
  bn: string;
  en: string;
}

/** 12 months in order, Boishakh first. Falgun's length varies - see falgunDayCount(). */
export const BENGALI_MONTHS: BengaliMonthInfo[] = [
  { bn: "বৈশাখ", en: "Boishakh" },
  { bn: "জ্যৈষ্ঠ", en: "Jyoishtho" },
  { bn: "আষাঢ়", en: "Asharh" },
  { bn: "শ্রাবণ", en: "Shrabon" },
  { bn: "ভাদ্র", en: "Bhadro" },
  { bn: "আশ্বিন", en: "Ashwin" },
  { bn: "কার্তিক", en: "Kartik" },
  { bn: "অগ্রহায়ণ", en: "Ogrohayon" },
  { bn: "পৌষ", en: "Poush" },
  { bn: "মাঘ", en: "Magh" },
  { bn: "ফাল্গুন", en: "Falgun" },
  { bn: "চৈত্র", en: "Choitro" }
];

const FALGUN_INDEX = 10;
const FIXED_MONTH_DAYS = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, null, 30] as const;

export const BENGALI_WEEKDAYS: BengaliMonthInfo[] = [
  { bn: "রবিবার", en: "Sunday" },
  { bn: "সোমবার", en: "Monday" },
  { bn: "মঙ্গলবার", en: "Tuesday" },
  { bn: "বুধবার", en: "Wednesday" },
  { bn: "বৃহস্পতিবার", en: "Thursday" },
  { bn: "শুক্রবার", en: "Friday" },
  { bn: "শনিবার", en: "Saturday" }
];

/** Short weekday labels for a compact month-grid calendar header. */
export const BENGALI_WEEKDAYS_SHORT: BengaliMonthInfo[] = [
  { bn: "রবি", en: "Sun" },
  { bn: "সোম", en: "Mon" },
  { bn: "মঙ্গল", en: "Tue" },
  { bn: "বুধ", en: "Wed" },
  { bn: "বৃহ", en: "Thu" },
  { bn: "শুক্র", en: "Fri" },
  { bn: "শনি", en: "Sat" }
];

const NEW_YEAR_GREGORIAN_MONTH = 3; // April, 0-indexed
const NEW_YEAR_GREGORIAN_DAY = 15;
/** Bengali San (Bangabda) epoch offset: Gregorian year - 593 = Bengali year, for dates on/after 15 April. */
const ERA_OFFSET = 593;
const MS_PER_DAY = 86_400_000;

export interface BengaliDate {
  /** Bengali San (Bangabda) year, e.g. 1433. */
  year: number;
  /** 1-indexed month, Boishakh = 1. */
  month: number;
  /** 1-indexed day within the month. */
  day: number;
  monthNameBn: string;
  monthNameEn: string;
  weekdayNameBn: string;
  weekdayNameEn: string;
}

function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function atLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Whole calendar days between two local dates, and adding N calendar days
 * to a local date. Both go through Date.UTC rather than dividing a raw
 * millisecond difference by 86400000 - a local-time day can be 23 or 25
 * hours across a DST transition, which silently corrupts day counts if you
 * don't route through UTC first.
 */
function daysBetween(from: Date, to: Date): number {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / MS_PER_DAY);
}

function addDays(date: Date, days: number): Date {
  const utcMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) + days * MS_PER_DAY;
  const utcDate = new Date(utcMs);
  return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
}

function newYearStartFor(gregorianYear: number): Date {
  return new Date(gregorianYear, NEW_YEAR_GREGORIAN_MONTH, NEW_YEAR_GREGORIAN_DAY);
}

/**
 * Falgun (month 11) absorbs the leap day: it spans mid-February to
 * mid-March of the Gregorian year *after* the Bengali year's Poila
 * Boishakh, so it gets 31 days exactly when that February is a leap
 * February - keeping every Bengali year's total in sync with the actual
 * number of days between consecutive 15 Aprils.
 */
function falgunDayCount(newYearGregorianYear: number): number {
  return isGregorianLeapYear(newYearGregorianYear + 1) ? 31 : 30;
}

function monthDayCount(monthIndex: number, newYearGregorianYear: number): number {
  return monthIndex === FALGUN_INDEX
    ? falgunDayCount(newYearGregorianYear)
    : (FIXED_MONTH_DAYS[monthIndex] as number);
}

/** Converts a Gregorian calendar date to its Bengali (Bangabda) equivalent. */
export function gregorianToBengali(date: Date): BengaliDate {
  const today = atLocalMidnight(date);
  const y = today.getFullYear();
  const thisYearNewYear = newYearStartFor(y);
  const isOnOrAfterNewYear = today.getTime() >= thisYearNewYear.getTime();
  const newYearStart = isOnOrAfterNewYear ? thisYearNewYear : newYearStartFor(y - 1);
  const newYearGregorianYear = newYearStart.getFullYear();
  const bengaliYear = newYearGregorianYear - ERA_OFFSET;

  let remaining = daysBetween(newYearStart, today);
  for (let i = 0; i < BENGALI_MONTHS.length; i++) {
    const days = monthDayCount(i, newYearGregorianYear);
    if (remaining < days) {
      return {
        year: bengaliYear,
        month: i + 1,
        day: remaining + 1,
        monthNameBn: BENGALI_MONTHS[i].bn,
        monthNameEn: BENGALI_MONTHS[i].en,
        weekdayNameBn: BENGALI_WEEKDAYS[today.getDay()].bn,
        weekdayNameEn: BENGALI_WEEKDAYS[today.getDay()].en
      };
    }
    remaining -= days;
  }
  throw new Error(`date ${date.toISOString()} fell outside its computed Bengali year - this is a bug`);
}

/** Converts a Bengali (Bangabda) calendar date back to its Gregorian equivalent. */
export function bengaliToGregorian(year: number, month: number, day: number): Date {
  if (month < 1 || month > 12) throw new Error(`Bengali month must be 1-12, got ${month}`);
  const newYearGregorianYear = year + ERA_OFFSET;
  const newYearStart = newYearStartFor(newYearGregorianYear);

  let offset = 0;
  for (let i = 0; i < month - 1; i++) {
    offset += monthDayCount(i, newYearGregorianYear);
  }
  offset += day - 1;
  return addDays(newYearStart, offset);
}

/** Number of days in a given Bengali month (1-12) of a given Bengali year - 30 or 31, or Falgun's 30/31 leap variant. */
export function bengaliMonthLength(year: number, month: number): number {
  if (month < 1 || month > 12) throw new Error(`Bengali month must be 1-12, got ${month}`);
  return monthDayCount(month - 1, year + ERA_OFFSET);
}

/**
 * The Gregorian weekday (0=Sunday..6=Saturday) that a Bengali month's
 * first day falls on - the offset a month-grid calendar needs for its
 * leading blank cells.
 */
export function bengaliMonthStartWeekday(year: number, month: number): number {
  return bengaliToGregorian(year, month, 1).getDay();
}

/** Adds `delta` months to a Bengali (year, month) pair, wrapping the year at the Boishakh/Choitro boundary. */
export function addBengaliMonths(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const zeroIndexed = month - 1 + delta;
  const wrappedYear = year + Math.floor(zeroIndexed / 12);
  const wrappedMonth = ((zeroIndexed % 12) + 12) % 12;
  return { year: wrappedYear, month: wrappedMonth + 1 };
}

/**
 * Formats a Bengali date for display, e.g. "৭ আশ্বিন ১৪৩৩, বুধবার" (bn) or
 * "7 Ashwin 1433, Wednesday" (en). Bengali-numeral formatting is applied
 * here (via the caller-supplied digit formatter) rather than left to UI
 * components, per this package's "no Bengali presentation logic in React"
 * convention.
 */
export function formatBengaliDate(
  bengaliDate: BengaliDate,
  locale: "bn" | "en",
  toDigits: (n: number) => string
): string {
  if (locale === "bn") {
    return `${toDigits(bengaliDate.day)} ${bengaliDate.monthNameBn} ${toDigits(bengaliDate.year)}, ${bengaliDate.weekdayNameBn}`;
  }
  return `${bengaliDate.day} ${bengaliDate.monthNameEn} ${bengaliDate.year}, ${bengaliDate.weekdayNameEn}`;
}
