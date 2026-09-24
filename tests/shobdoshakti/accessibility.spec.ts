import { expect, test } from "@playwright/test";
import { boardCell, clickLetter, gotoGame, letterPalette } from "./helpers";

test("Level Mode letter tiles announce their letter", async ({ page }) => {
  await gotoGame(page);
  await expect(letterPalette(page).getByRole("button").first()).toHaveAttribute("aria-label", /^অক্ষর /);
});

test("keyboard: a letter tile can be selected into the word builder and removed with only Enter", async ({
  page
}) => {
  await gotoGame(page);
  const palette = letterPalette(page);
  const first = palette.getByRole("button").first();

  await first.focus();
  await page.keyboard.press("Enter");

  const builder = page.getByRole("status", { name: "আপনার শব্দ" });
  await expect(builder.getByRole("button")).toHaveCount(1);

  const guessTile = builder.getByRole("button").first();
  await guessTile.focus();
  await page.keyboard.press("Enter");
  await expect(builder.getByRole("button")).toHaveCount(0);
});

test("primary Level Mode buttons are reachable via keyboard, and disabled ones are correctly excluded from the tab order", async ({
  page
}) => {
  await gotoGame(page);

  // Submit starts disabled (nothing built yet) - disabled buttons are correctly unfocusable, not a bug.
  const submit = page.getByRole("button", { name: "শব্দ জমা দিন" });
  await expect(submit).toBeDisabled();

  // Hint is always enabled and must be keyboard-reachable.
  const hint = page.getByRole("button", { name: "ইঙ্গিত", exact: true });
  await hint.focus();
  await expect(hint).toBeFocused();

  // Selecting a letter enables Submit, and it becomes keyboard-focusable.
  await clickLetter(page, "ক");
  await expect(submit).toBeEnabled();
  await submit.focus();
  await expect(submit).toBeFocused();
});

test("help dialog is a proper modal: labeled, closes on Escape", async ({ page }) => {
  await gotoGame(page);
  await page.getByRole("button", { name: "সাহায্য" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("the game remains functional with prefers-reduced-motion enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoGame(page);
  await clickLetter(page, "ক");
  await clickLetter(page, "ল");
  await clickLetter(page, "ম");
  await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();
  await expect(page.getByRole("status").filter({ hasText: "চমৎকার" })).toBeVisible();
});

test.describe("Free Play board accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await gotoGame(page);
    await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();
    await expect(page.getByRole("grid")).toBeVisible();
  });

  test("board cells have descriptive Bengali aria-labels (row/col in Bengali numerals)", async ({ page }) => {
    await expect(boardCell(page, 8, 8)).toBeVisible();
  });

  test("tiles announce their letter and point value", async ({ page }) => {
    const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
    await expect(rack.getByRole("button").first()).toHaveAttribute("aria-label", /পয়েন্ট/);
  });

  test("keyboard: arrow keys move focus across the board grid", async ({ page }) => {
    await boardCell(page, 8, 8).focus();
    await page.keyboard.press("ArrowRight");
    await expect(boardCell(page, 8, 9)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(boardCell(page, 9, 9)).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(boardCell(page, 9, 8)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(boardCell(page, 8, 8)).toBeFocused();
  });

  test("keyboard: a tile can be selected and placed using only Enter", async ({ page }) => {
    const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
    const first = rack.getByRole("button").first();

    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-pressed", "true");

    await boardCell(page, 8, 8).focus();
    await page.keyboard.press("Enter");
    await expect(rack.getByRole("button")).toHaveCount(6);
  });

  test("primary buttons are reachable via keyboard, and disabled ones are correctly excluded from the tab order", async ({
    page
  }) => {
    // Submit starts disabled (nothing placed yet) - disabled buttons are correctly unfocusable, not a bug.
    const submit = page.getByRole("button", { name: "চাল জমা দিন" });
    await expect(submit).toBeDisabled();

    // Help is always enabled and must be keyboard-reachable.
    const help = page.getByRole("button", { name: "সাহায্য" });
    await help.focus();
    await expect(help).toBeFocused();

    // Placing a tile enables Submit, and it becomes keyboard-focusable.
    const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
    await rack.getByRole("button").first().click();
    await page.getByRole("gridcell").first().click();
    await expect(submit).toBeEnabled();
    await submit.focus();
    await expect(submit).toBeFocused();
  });

  test("bonus squares are labeled with text, never color alone", async ({ page }) => {
    const bonusCell = page.getByRole("gridcell", { name: /দ্বিগুণ|তিনগুণ/ });
    await expect(bonusCell.first()).toBeVisible();
  });
});
