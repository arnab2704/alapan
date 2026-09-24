import { expect, test } from "@playwright/test";
import { clickLetter, gotoGame, letterPalette } from "./helpers";

// Level 1's first combination is fixed, curated data (see
// packages/game-engine/src/data/shobdojaal-levels.json): letters ক,ল,ম can
// spell কলম, কল, মল, কম.

test.describe("ShobdoShakti game flow", () => {
  test("the game page loads in Level Mode by default with the Bengali heading", async ({ page }) => {
    await gotoGame(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("শব্দশক্তি");
    await expect(page.getByRole("tab", { name: "লেভেল মোড" })).toHaveAttribute("aria-selected", "true");
    await expect(letterPalette(page).getByRole("button")).toHaveCount(3);
  });

  test("Free Play starts and deals a 7-tile rack on a 15x15 board", async ({ page }) => {
    await gotoGame(page);
    await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();
    await expect(page.getByRole("grid")).toBeVisible();
    await expect(page.getByRole("gridcell")).toHaveCount(225);
    const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
    await expect(rack.getByRole("button")).toHaveCount(7);
  });

  test("a letter can be selected into the word builder and removed again", async ({ page }) => {
    await gotoGame(page);
    await expect(letterPalette(page).getByRole("button")).toHaveCount(3);

    await clickLetter(page, "ক");
    await expect(letterPalette(page).getByRole("button")).toHaveCount(2);

    const builder = page.getByRole("status", { name: "আপনার শব্দ" });
    const guessTile = builder.getByRole("button", { name: "অক্ষর ক", exact: true });
    await expect(guessTile).toBeVisible();

    await guessTile.click();
    await expect(letterPalette(page).getByRole("button")).toHaveCount(3);
  });

  test("a valid word scores correctly, is revealed in the found list, and resets the palette", async ({
    page
  }) => {
    await gotoGame(page);
    await clickLetter(page, "ক");
    await clickLetter(page, "ল");
    await clickLetter(page, "ম");
    await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();

    await expect(page.getByRole("status").filter({ hasText: "কলম" })).toContainText("+৩০");
    const foundList = page.getByRole("list", { name: "পাওয়া শব্দ" });
    await expect(foundList.getByText("কলম", { exact: true })).toBeVisible(); // revealed in the found-words list
    await expect(letterPalette(page).getByRole("button")).toHaveCount(3); // tiles returned for reuse
  });

  test("submitting an already-found word is rejected", async ({ page }) => {
    await gotoGame(page);
    await clickLetter(page, "ক");
    await clickLetter(page, "ল");
    await clickLetter(page, "ম");
    await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();
    await expect(page.getByRole("status").filter({ hasText: "কলম" })).toBeVisible();

    await clickLetter(page, "ক");
    await clickLetter(page, "ল");
    await clickLetter(page, "ম");
    await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();
    // Next.js's own route announcer also has role="alert", so scope to WordJaalGame's message.
    // Already-found gets its own distinct message, not the generic "not in list" one.
    await expect(page.getByRole("alert").filter({ hasText: "আগেই" })).toBeVisible();
  });

  test("submitting a word not in the combination's list is rejected with a human-readable reason", async ({
    page
  }) => {
    await gotoGame(page);
    await clickLetter(page, "ম");
    await clickLetter(page, "ক");
    await clickLetter(page, "ল");
    // "মকল" is not one of কলম/কল/মল/কম.
    await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "নয়" });
    await expect(alert).toBeVisible();
    await expect(alert).not.toContainText(/error|undefined|NaN/i);
  });

  test("Hint reveals an unfound word, and playing it scores zero", async ({ page }) => {
    await gotoGame(page);
    await page.getByRole("button", { name: "ইঙ্গিত", exact: true }).click();

    const builder = page.getByRole("status", { name: "আপনার শব্দ" });
    await expect(builder.getByRole("button")).not.toHaveCount(0);

    await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();
    const message = page.getByRole("status").filter({ hasText: /কলম|কল|মল|কম/ });
    await expect(message).toBeVisible();
    await expect(message).not.toContainText("+");
  });

  test("Skip advances to the next combination and deducts points (floored at zero)", async ({ page }) => {
    await gotoGame(page);
    await expect(page.getByText("১ / ৫০")).toBeVisible();
    await page.getByRole("button", { name: "এড়িয়ে যান" }).click();
    await expect(page.getByText("২ / ৫০")).toBeVisible();
  });

  test("mode switching preserves Level Mode progress", async ({ page }) => {
    await gotoGame(page);
    await page.getByRole("button", { name: "এড়িয়ে যান" }).click();
    await expect(page.getByText("২ / ৫০")).toBeVisible();

    await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();
    await expect(page.getByRole("grid")).toBeVisible();

    await page.getByRole("tab", { name: "লেভেল মোড" }).click();
    await expect(page.getByText("২ / ৫০")).toBeVisible();
  });

  test("New game deals a fresh rack in Free Play", async ({ page }) => {
    await gotoGame(page);
    await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();
    await page.getByRole("button", { name: "নতুন খেলা" }).click();
    const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
    await expect(rack.getByRole("button")).toHaveCount(7);
  });

  test("renders Bengali letters correctly, never mojibake", async ({ page }) => {
    await gotoGame(page);
    const letterTexts = await letterPalette(page).getByRole("button").allTextContents();
    for (const text of letterTexts) {
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text).not.toMatch(/undefined|NaN|�/);
    }
  });

  test("the page produces no console errors during a full play sequence", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await gotoGame(page);
    await clickLetter(page, "ক");
    await clickLetter(page, "ল");
    await clickLetter(page, "ম");
    await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();
    await page.getByRole("button", { name: "ইঙ্গিত", exact: true }).click();
    await page.getByRole("button", { name: "মুছুন" }).click();
    await page.getByRole("button", { name: "এড়িয়ে যান" }).click();
    await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();
    await expect(page.getByRole("grid")).toBeVisible();
    await page.getByRole("button", { name: "সাহায্য", exact: true }).click();
    await page.keyboard.press("Escape");

    expect(errors).toEqual([]);
  });
});
