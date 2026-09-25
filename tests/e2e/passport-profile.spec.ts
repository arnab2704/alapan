import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

const slug = (w: string) => encodeURIComponent(w);

test("discoveries fill the Bengal Passport and show on the profile", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/passport");
  await expect(page.getByRole("heading", { name: "বাংলা পাসপোর্ট", level: 1 })).toBeVisible();
  await expect(page.getByText("শব্দ", { exact: true })).toBeVisible();

  // Opening two words records two discoveries; opening one again does not double count.
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("নদী")}`);
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("আকাশ")}`);
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("নদী")}`);

  await gotoWithoutWelcomeBanner(page, "/bn/passport");
  const stamp = page
    .getByRole("listitem")
    .filter({ has: page.getByText("শব্দ", { exact: true }) })
    .first();
  await expect(stamp).toContainText("২");
  await expect(stamp).toContainText("আর ৮টি");

  // Save a word, then see it on the profile.
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("আকাশ")}`);
  await page.getByRole("button", { name: "শব্দটি সংরক্ষণ করুন" }).click();
  await gotoWithoutWelcomeBanner(page, "/bn/profile");
  await expect(page.getByRole("heading", { name: "আমার আলাপন", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "আকাশ" })).toBeVisible();
  await expect(page.getByText("মোট ২টি আবিষ্কার")).toBeVisible();
  await page.getByRole("button", { name: "আকাশ সরিয়ে দিন" }).click();
  await expect(page.getByText("এখনও কোনো শব্দ সংরক্ষণ করেননি")).toBeVisible();
});

test("the profile shows today's Daily 5 progress and a guest greeting", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/today");
  await page.getByRole("button", { name: "অর্থ দেখুন" }).click();
  await gotoWithoutWelcomeBanner(page, "/bn/profile");
  await expect(page.getByText("স্বাগতম, অতিথি")).toBeVisible();
  await expect(page.getByText("আজকের ৫: ১/৫")).toBeVisible();
});

test("settings switch language and can clear this device's data after confirming", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("নদী")}`);
  await gotoWithoutWelcomeBanner(page, "/bn/settings");
  await page.getByRole("button", { name: "এই ডিভাইসের তথ্য মুছুন" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "না, থাক" }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  await page.getByRole("button", { name: "এই ডিভাইসের তথ্য মুছুন" }).click();
  await page.getByRole("button", { name: "হ্যাঁ, মুছে ফেলুন" }).click();
  await expect(page.getByRole("status")).toContainText("মুছে ফেলা হয়েছে");

  await gotoWithoutWelcomeBanner(page, "/bn/profile");
  await expect(page.getByText("মোট ০টি আবিষ্কার")).toBeVisible();

  await gotoWithoutWelcomeBanner(page, "/bn/settings");
  await page.getByRole("main").getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/settings$/);
  await expect(page.getByRole("heading", { name: "Settings", level: 1 })).toBeVisible();
});

test("finishing a lesson and a daily challenge add to the passport", async ({ page }) => {
  test.setTimeout(120_000);
  await gotoWithoutWelcomeBanner(page, "/bn/learn/vowels-1");
  for (let i = 0; i < 200; i++) {
    if (await page.getByRole("heading", { name: "পাঠ সম্পূর্ণ!" }).isVisible()) break;
    const gotIt = page.getByRole("button", { name: "বুঝেছি" });
    const next = page.getByRole("button", { name: "এগিয়ে চলুন" });
    const ids = await page
      .locator('[data-side="left"]:not([disabled])')
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-pair-id")));
    if (await gotIt.isVisible()) await gotIt.click();
    else if (await next.isVisible()) await next.click();
    else if (ids.length > 0) {
      for (const id of ids) {
        await page.locator(`[data-side="left"][data-pair-id="${id}"]`).click();
        await page.locator(`[data-side="right"][data-pair-id="${id}"]`).click();
      }
    } else {
      const option = page.locator('main [role="group"] button:not([disabled])').first();
      if (await option.isVisible()) await option.click();
      else await page.waitForTimeout(100);
    }
  }
  await gotoWithoutWelcomeBanner(page, "/bn/passport");
  const lessons = page
    .getByRole("listitem")
    .filter({ has: page.getByText("পাঠ", { exact: true }) })
    .first();
  await expect(lessons).toContainText("১");
});
