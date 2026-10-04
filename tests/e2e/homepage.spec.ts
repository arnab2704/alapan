import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("redirects to the default Bengali locale and renders the homepage", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/");
  await expect(page).toHaveURL(/\/bn$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("প্রতিদিন বাংলার সঙ্গে একটু সময়।");
  await expect(page.getByRole("link", { name: "আজ শুরু করুন" })).toHaveAttribute("href", "/bn/today");
  await expect(page.getByRole("heading", { name: "আজকের ৫", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "আজকের আলাপন", level: 2 })).toBeVisible();
  await expect(page.getByRole("link", { name: "খেলা শুরু করুন" })).toHaveAttribute(
    "href",
    "/bn/play/shobdoshakti"
  );
});

test("the primary navigation has five direct section links and marks the current section", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/play");
  const nav = page.getByRole("banner").getByRole("navigation", { name: "প্রধান নেভিগেশন" });
  const expected: Array<[string, string]> = [
    ["আজ", "/bn/today"],
    ["খেলুন", "/bn/play"],
    ["শিখুন", "/bn/learn"],
    ["আবিষ্কার", "/bn/discover"],
    ["আড্ডা", "/bn/theke-adda"]
  ];
  for (const [label, href] of expected) {
    await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  await expect(nav.getByRole("link", { name: "খেলুন", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "আজ", exact: true })).not.toHaveAttribute(
    "aria-current",
    "page"
  );
  // Quiz belongs to the Play section.
  await gotoWithoutWelcomeBanner(page, "/bn/quiz");
  await expect(nav.getByRole("link", { name: "খেলুন", exact: true })).toHaveAttribute("aria-current", "page");
  // The bottom bar is for small screens only.
  await expect(page.locator("nav.fixed")).toBeHidden();
});

test("on a phone the sections move to a bottom bar, which hides on game screens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoWithoutWelcomeBanner(page, "/bn");
  await expect(page.getByRole("banner").getByRole("navigation")).toBeHidden();

  const bar = page.locator("nav.fixed");
  await expect(bar).toBeVisible();
  for (const label of ["আজ", "খেলুন", "শিখুন", "আবিষ্কার", "আড্ডা"]) {
    await expect(bar.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await bar.getByRole("link", { name: "শিখুন", exact: true }).click();
  await expect(page).toHaveURL(/\/bn\/learn$/);
  await expect(bar.getByRole("link", { name: "শিখুন", exact: true })).toHaveAttribute("aria-current", "page");

  await gotoWithoutWelcomeBanner(page, "/bn/learn/vowels-1");
  await expect(page.locator("nav.fixed")).toHaveCount(0);
});

test("the header fits a 320px phone and the one-tap language toggle works", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await gotoWithoutWelcomeBanner(page, "/bn");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
  expect(overflow).toBe(false);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("nav.fixed").getByRole("link", { name: "Today", exact: true })).toBeVisible();
});

test("search finds words in Bengali and English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/search");
  await page.getByRole("searchbox").fill("আড্ডা");
  await expect(page.getByRole("heading", { name: "শব্দ", level: 2 })).toBeVisible();
  await page.getByRole("searchbox").fill("tagore");
  await expect(page.getByText("রবীন্দ্রনাথ ঠাকুর").first()).toBeVisible();
  await page.getByRole("searchbox").fill("zzzzqq");
  await expect(page.getByRole("status")).toContainText("কিছু পাওয়া যায়নি");
});

test("language switcher navigates between Bengali and English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A few minutes with Bengal, every day."
  );
});

test("shows the Durga Puja hero art and a Puja CTA in the lead-up to Sharodiya", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await expect(
    page
      .locator("main section")
      .first()
      .getByRole("link", { name: /শারদোৎসব/ })
  ).toBeVisible();
  const heroImages = page.locator("main img[src*='hero-puja.webp']");
  await expect(heroImages.first()).toBeVisible();
});
