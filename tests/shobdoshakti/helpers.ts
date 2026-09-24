import type { Page } from "@playwright/test";

/**
 * Navigates to the ShobdoShakti game with the first-visit onboarding
 * dialog AND the site-wide welcome banner pre-dismissed (via an init
 * script that runs before any page script), so individual tests don't all
 * need to click through them first.
 */
export async function gotoGame(page: Page, path = "/bn/play/shobdoshakti") {
  await page.addInitScript(() => {
    window.localStorage.setItem("alapon.shobdoshakti.onboarding-dismissed.v1", "1");
    window.sessionStorage.setItem("alapon.welcome-banner-dismissed.v1", "1");
  });
  await page.goto(path);
  await page.locator('html[data-hydrated="true"]').waitFor({ state: "attached" });
  await page.waitForLoadState("networkidle");
}

/**
 * A cell's accessible name varies by state: plain ("বোর্ডের ঘর ৮, ৮"),
 * with a tile ("...: গ"), or with a bonus ("..., অক্ষরের মান দ্বিগুণ") - see
 * BoardCell.tsx. Match on the row/col prefix only, anchored so "৮, ১" never
 * matches "৮, ১০" too.
 */
export function boardCell(page: Page, row: number, col: number) {
  const bnRow = toBengaliDigits(row);
  const bnCol = toBengaliDigits(col);
  return page.getByRole("gridcell", { name: new RegExp(`^বোর্ডের ঘর ${bnRow}, ${bnCol}($|[,:])`) });
}

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBengaliDigits(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]);
}

/** The Level Mode letter palette (available, not-yet-guessed tiles). */
export function letterPalette(page: Page) {
  return page.getByRole("group", { name: "আপনার অক্ষর" });
}

/**
 * Clicks one available letter tile matching `letter`. Combinations can
 * repeat a letter (e.g. "কাকা"), so multiple tiles can share the same
 * accessible name - always clicks the first match, same as the real UI
 * (any instance of that letter is interchangeable).
 */
export async function clickLetter(page: Page, letter: string) {
  await letterPalette(page)
    .getByRole("button", { name: `অক্ষর ${letter}`, exact: true })
    .first()
    .click();
}
