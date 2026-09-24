const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Converts ASCII digits in a number/string to Bengali numerals, e.g. 8 -> "৮",
 * "127/1000" -> "১২৭/১০০০". Non-digit characters pass through unchanged.
 * Presentation logic like this belongs in the Bengali engine, not scattered
 * across UI components, per the "UI never implements Bengali linguistic
 * logic" rule.
 */
export function toBengaliDigits(input: number | string): string {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}
