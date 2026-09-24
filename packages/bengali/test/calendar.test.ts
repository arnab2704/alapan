import { describe, expect, it } from "vitest";
import {
  addBengaliMonths,
  bengaliMonthLength,
  bengaliMonthStartWeekday,
  bengaliToGregorian,
  formatBengaliDate,
  gregorianToBengali
} from "../src/calendar";
import { toBengaliDigits } from "../src/numerals";

describe("gregorianToBengali", () => {
  it("maps 15 April to Boishakh 1 of the new Bengali year", () => {
    const result = gregorianToBengali(new Date(2026, 3, 15));
    expect(result).toMatchObject({ year: 1433, month: 1, day: 1, monthNameEn: "Boishakh" });
  });

  it("maps 14 April to the last day (Choitro 30) of the previous Bengali year", () => {
    const result = gregorianToBengali(new Date(2026, 3, 14));
    expect(result).toMatchObject({ year: 1432, month: 12, day: 30, monthNameEn: "Choitro" });
  });

  it("computes a mid-year date correctly", () => {
    const result = gregorianToBengali(new Date(2026, 8, 23));
    expect(result).toMatchObject({
      year: 1433,
      month: 6,
      day: 7,
      monthNameEn: "Ashwin",
      monthNameBn: "আশ্বিন"
    });
    expect(result.weekdayNameEn).toBe("Wednesday");
  });

  it("gives Falgun 31 days when its February falls in a Gregorian leap year", () => {
    // Falgun of Bengali year starting April 2027 spans Feb-Mar 2028 (leap Feb).
    const lastDayOfFalgun = gregorianToBengali(new Date(2028, 2, 15)); // 15 March 2028
    expect(lastDayOfFalgun).toMatchObject({ month: 11, day: 31, monthNameEn: "Falgun" });
    const firstDayOfChoitro = gregorianToBengali(new Date(2028, 2, 16)); // 16 March 2028
    expect(firstDayOfChoitro).toMatchObject({ month: 12, day: 1, monthNameEn: "Choitro" });
  });

  it("gives Falgun only 30 days in a non-leap year", () => {
    // Falgun of Bengali year starting April 2026 spans Feb-Mar 2027 (not leap).
    const lastDayOfFalgun = gregorianToBengali(new Date(2027, 2, 15)); // 15 March 2027
    expect(lastDayOfFalgun).toMatchObject({ month: 11, day: 30, monthNameEn: "Falgun" });
    const firstDayOfChoitro = gregorianToBengali(new Date(2027, 2, 16)); // 16 March 2027
    expect(firstDayOfChoitro).toMatchObject({ month: 12, day: 1, monthNameEn: "Choitro" });
  });
});

describe("bengaliToGregorian", () => {
  it("round-trips through gregorianToBengali for a range of dates", () => {
    const samples = [
      new Date(2026, 3, 15),
      new Date(2026, 8, 23),
      new Date(2027, 3, 14),
      new Date(2028, 1, 29)
    ];
    for (const original of samples) {
      const bengali = gregorianToBengali(original);
      const backToGregorian = bengaliToGregorian(bengali.year, bengali.month, bengali.day);
      expect(backToGregorian.toDateString()).toBe(original.toDateString());
    }
  });

  it("rejects an out-of-range month", () => {
    expect(() => bengaliToGregorian(1433, 13, 1)).toThrow();
  });
});

describe("bengaliMonthLength", () => {
  it("gives fixed-length months their documented day count", () => {
    expect(bengaliMonthLength(1433, 1)).toBe(31); // Boishakh
    expect(bengaliMonthLength(1433, 6)).toBe(30); // Ashwin
  });

  it("gives Falgun 30 or 31 days depending on the following Gregorian February", () => {
    expect(bengaliMonthLength(1433, 11)).toBe(30); // Falgun spans Feb-Mar 2027, not leap
    expect(bengaliMonthLength(1434, 11)).toBe(31); // Falgun spans Feb-Mar 2028, leap
  });

  it("rejects an out-of-range month", () => {
    expect(() => bengaliMonthLength(1433, 0)).toThrow();
  });
});

describe("bengaliMonthStartWeekday", () => {
  it("matches the real weekday of Boishakh 1, 1433 (15 April 2026, a Wednesday)", () => {
    expect(bengaliMonthStartWeekday(1433, 1)).toBe(new Date(2026, 3, 15).getDay());
  });
});

describe("addBengaliMonths", () => {
  it("advances within a year", () => {
    expect(addBengaliMonths(1433, 6, 2)).toEqual({ year: 1433, month: 8 });
  });

  it("wraps forward into the next year at the Choitro/Boishakh boundary", () => {
    expect(addBengaliMonths(1433, 12, 1)).toEqual({ year: 1434, month: 1 });
  });

  it("wraps backward into the previous year", () => {
    expect(addBengaliMonths(1433, 1, -1)).toEqual({ year: 1432, month: 12 });
  });

  it("handles multi-year jumps in either direction", () => {
    expect(addBengaliMonths(1433, 6, 18)).toEqual({ year: 1434, month: 12 });
    expect(addBengaliMonths(1433, 6, -18)).toEqual({ year: 1431, month: 12 });
  });
});

describe("formatBengaliDate", () => {
  it("formats in Bengali with Bengali numerals", () => {
    const bengali = gregorianToBengali(new Date(2026, 8, 23));
    expect(formatBengaliDate(bengali, "bn", toBengaliDigits)).toBe("৭ আশ্বিন ১৪৩৩, বুধবার");
  });

  it("formats in English with Latin numerals", () => {
    const bengali = gregorianToBengali(new Date(2026, 8, 23));
    expect(formatBengaliDate(bengali, "en", (n) => String(n))).toBe("7 Ashwin 1433, Wednesday");
  });
});
