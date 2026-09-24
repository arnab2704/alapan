import { expect, test } from "@playwright/test";
import { clickLetter, gotoGame, letterPalette } from "./helpers";

// Spec §19: must work at every one of these widths with no page-level horizontal scroll.
const BREAKPOINTS = [320, 360, 390, 430, 768, 1024, 1280, 1440];

for (const width of BREAKPOINTS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await gotoGame(page);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
}

test("at 320px the letter palette, word builder and submit button all remain visible and tappable", async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await gotoGame(page);

  const firstTile = letterPalette(page).getByRole("button").first();
  await expect(firstTile).toBeVisible();
  const tileBox = await firstTile.boundingBox();
  expect(tileBox?.width).toBeGreaterThanOrEqual(40);
  expect(tileBox?.height).toBeGreaterThanOrEqual(40);

  const builder = page.getByRole("status", { name: "আপনার শব্দ" });
  await expect(builder).toBeVisible();

  const submit = page.getByRole("button", { name: "শব্দ জমা দিন" });
  await expect(submit).toBeVisible();
  const submitBox = await submit.boundingBox();
  expect(submitBox?.height).toBeGreaterThanOrEqual(40);
});

test("mobile order is header -> mode -> score -> level progress -> word builder -> letters -> found words", async ({
  page
}) => {
  await page.setViewportSize({ width: 375, height: 1400 });
  await gotoGame(page);

  const heading = page.getByRole("heading", { level: 1 });
  const modeToggle = page.getByRole("tablist");
  const progress = page.getByRole("progressbar");
  const builder = page.getByRole("status", { name: "আপনার শব্দ" });
  const palette = letterPalette(page);
  const submit = page.getByRole("button", { name: "শব্দ জমা দিন" });
  const foundList = page.getByRole("list", { name: "পাওয়া শব্দ" });

  const positions = await Promise.all(
    [heading, modeToggle, progress, builder, palette, submit, foundList].map(async (locator) => {
      const box = await locator.boundingBox();
      return box?.y ?? Number.POSITIVE_INFINITY;
    })
  );

  for (let i = 1; i < positions.length; i++) {
    expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  }
});

test("desktop viewport shows the word panel and found-words panel side by side, not stacked", async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoGame(page);

  const builder = page.getByRole("status", { name: "আপনার শব্দ" });
  const foundList = page.getByRole("list", { name: "পাওয়া শব্দ" });
  const builderBox = await builder.boundingBox();
  const foundListBox = await foundList.boundingBox();

  expect(foundListBox!.x).toBeGreaterThan(builderBox!.x + builderBox!.width);
});

test("Free Play desktop viewport shows the board and rack side by side, not stacked", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoGame(page);
  await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();

  const board = page.getByRole("grid");
  const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
  const boardBox = await board.boundingBox();
  const rackBox = await rack.boundingBox();

  expect(rackBox!.x).toBeGreaterThan(boardBox!.x + boardBox!.width - 50);
  expect(boardBox!.width).toBeLessThanOrEqual(760);
});

test("Free Play at 320px keeps the board, rack and submit button visible and tappable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await gotoGame(page);
  await page.getByRole("tab", { name: "মুক্ত খেলা" }).click();

  await expect(page.getByRole("grid")).toBeVisible();

  const rack = page.getByRole("group", { name: "আপনার অক্ষর" });
  const firstTile = rack.getByRole("button").first();
  await expect(firstTile).toBeVisible();
  const tileBox = await firstTile.boundingBox();
  expect(tileBox?.width).toBeGreaterThanOrEqual(40);
  expect(tileBox?.height).toBeGreaterThanOrEqual(40);

  const submit = page.getByRole("button", { name: "চাল জমা দিন" });
  await expect(submit).toBeVisible();
  const submitBox = await submit.boundingBox();
  expect(submitBox?.height).toBeGreaterThanOrEqual(40);
});

test("selecting and submitting a word works at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await gotoGame(page);

  await clickLetter(page, "ক");
  await clickLetter(page, "ল");
  await clickLetter(page, "ম");
  await page.getByRole("button", { name: "শব্দ জমা দিন" }).click();

  await expect(page.getByRole("status").filter({ hasText: "কলম" })).toBeVisible();
});
