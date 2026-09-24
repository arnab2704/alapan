import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

/** Plays a lesson to the end: reads intro cards, picks the first option, solves matches from data attributes and uses hints for word-building. */
async function finishLesson(page: Page) {
  const done = page.getByRole("heading", { name: "পাঠ সম্পূর্ণ!" });
  for (let i = 0; i < 200; i++) {
    if (await done.isVisible()) return;

    const gotIt = page.getByRole("button", { name: "বুঝেছি" });
    if (await gotIt.isVisible()) {
      await gotIt.click();
      continue;
    }
    const next = page.getByRole("button", { name: "এগিয়ে চলুন" });
    if (await next.isVisible()) {
      await next.click();
      continue;
    }

    const ids = await page
      .locator('[data-side="left"]:not([disabled])')
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-pair-id")));
    if (ids.length > 0) {
      for (const id of ids) {
        await page.locator(`[data-side="left"][data-pair-id="${id}"]`).click();
        await page.locator(`[data-side="right"][data-pair-id="${id}"]`).click();
      }
      continue;
    }

    const hint = page.getByRole("button", { name: "সাহায্য" });
    if (await hint.isVisible()) {
      const check = page.getByRole("button", { name: "যাচাই করুন" });
      while (await check.isDisabled()) await hint.click();
      await check.click();
      continue;
    }

    const option = page.locator('main [role="group"] button:not([disabled])').first();
    if (await option.isVisible()) {
      await option.click();
      continue;
    }
    await page.waitForTimeout(100);
  }
  throw new Error("The lesson did not finish");
}

test("the Learn page lays out the course from scratch and starts at the first lesson", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/learn");
  await expect(page.getByRole("heading", { name: "বাংলা শিখুন", level: 2 })).toBeVisible();
  for (const unit of ["স্বরবর্ণ", "ব্যঞ্জনবর্ণ", "কার-চিহ্ন", "সংখ্যা", "শব্দভাণ্ডার", "যুক্তাক্ষর"]) {
    await expect(page.getByRole("heading", { name: new RegExp(unit) })).toBeVisible();
  }
  await page.getByRole("link", { name: "শুরু করুন" }).click();
  await expect(page).toHaveURL(/\/bn\/learn\/vowels-1$/);
  await expect(page.getByText("নতুন শিখুন")).toBeVisible();
  await expect(page.getByText("অ", { exact: true }).first()).toBeVisible();
});

test("a letters lesson can be completed and progress is remembered", async ({ page }) => {
  test.setTimeout(90_000);
  await gotoWithoutWelcomeBanner(page, "/bn/learn/vowels-1");
  await finishLesson(page);
  await expect(page.getByText(/\+[০-৯]+ পয়েন্ট/)).toBeVisible();

  await page.goto("/bn/learn");
  await expect(page.getByRole("link", { name: /অ আ ই ঈ/ })).toContainText("⭐");
  await expect(page.getByText(/^১\/[০-৯]+$/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "চালিয়ে যান" }).or(page.getByRole("link", { name: "এগিয়ে চলুন" }))
  ).toBeVisible();
});

test("a vocabulary lesson includes word-building and can be completed", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/learn/words-2");
  await finishLesson(page);
  await expect(page.getByRole("heading", { name: "পাঠ সম্পূর্ণ!" })).toBeVisible();
});

test("a numbers lesson can be completed", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/learn/numbers-1");
  await finishLesson(page);
});

test("the alphabet chart lists every vowel and the lesson works in English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/en/learn/alphabet");
  await expect(page.getByRole("heading", { name: "Alphabet chart" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vowels" })).toBeVisible();
  await expect(page.getByText("ঔ", { exact: true })).toBeVisible();

  await gotoWithoutWelcomeBanner(page, "/en/learn/vowels-1");
  await expect(page.getByText("New", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Got it" })).toBeVisible();
});

test("an unknown lesson is a 404", async ({ page }) => {
  const response = await page.goto("/bn/learn/no-such-lesson");
  expect(response?.status()).toBe(404);
});

test("the lesson screen fits a 320px phone without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ["/bn/learn", "/bn/learn/words-1", "/bn/learn/alphabet"]) {
    await gotoWithoutWelcomeBanner(page, path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow, path).toBe(false);
  }
});

test("no screen of a long-word lesson overflows a 320px phone", async ({ page }) => {
  test.setTimeout(120_000); // steps through three whole lessons
  await page.setViewportSize({ width: 320, height: 640 });
  for (const lesson of ["words-1", "words-8", "conjuncts-1"]) {
    await gotoWithoutWelcomeBanner(page, `/bn/learn/${lesson}`);
    const done = page.getByRole("heading", { name: "পাঠ সম্পূর্ণ!" });
    for (let step = 0; step < 80 && !(await done.isVisible()); step++) {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(overflow, `${lesson} step ${step}`).toBe(false);

      const gotIt = page.getByRole("button", { name: "বুঝেছি" });
      const next = page.getByRole("button", { name: "এগিয়ে চলুন" });
      const ids = await page
        .locator('[data-side="left"]:not([disabled])')
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-pair-id")));
      const hint = page.getByRole("button", { name: "সাহায্য" });
      if (await gotIt.isVisible()) await gotIt.click();
      else if (await next.isVisible()) await next.click();
      else if (ids.length > 0) {
        for (const id of ids) {
          await page.locator(`[data-side="left"][data-pair-id="${id}"]`).click();
          await page.locator(`[data-side="right"][data-pair-id="${id}"]`).click();
        }
      } else if (await hint.isVisible()) {
        const check = page.getByRole("button", { name: "যাচাই করুন" });
        while (await check.isDisabled()) await hint.click();
        await check.click();
      } else {
        const option = page.locator('main [role="group"] button:not([disabled])').first();
        if (await option.isVisible()) await option.click();
        else await page.waitForTimeout(100);
      }
    }
  }
});
