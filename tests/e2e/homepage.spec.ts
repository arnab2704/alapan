import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("redirects to the default Bengali locale and renders the homepage", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/");
  await expect(page).toHaveURL(/\/bn$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("বাংলার ডিজিটাল আলাপন");
});

test("the mega menu groups the site's pages and opens without any scrollbar", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  const nav = page.getByRole("navigation", { name: "Primary" });

  const links: Array<[string, string, string]> = [
    ["আজ ও উৎসব", "ক্যালেন্ডার", "/bn/calendar"],
    ["আজ ও উৎসব", "শারদোৎসব", "/bn/puja"],
    ["শিখুন ও খেলুন", "কুইজ", "/bn/quiz"],
    ["শিখুন ও খেলুন", "শব্দশক্তি", "/bn/play/shobdoshakti"],
    ["আড্ডা ও আবিষ্কার", "ঠেকের আড্ডা", "/bn/theke-adda"],
    ["আড্ডা ও আবিষ্কার", "আবিষ্কার করুন", "/bn/discover"]
  ];
  for (const [group, label, href] of links) {
    await nav.getByRole("button", { name: group }).click();
    const panel = page.locator("header").locator("[id^=menu-]");
    await expect(panel.getByRole("link", { name: new RegExp(`^${label}`) })).toHaveAttribute("href", href);
    await page.keyboard.press("Escape");
  }

  // The header itself never scrolls sideways.
  const overflow = await page.evaluate(() => {
    const header = document.querySelector("header") as HTMLElement;
    return header.scrollWidth > header.clientWidth;
  });
  expect(overflow).toBe(false);
});

test("the mega menu becomes a menu button on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoWithoutWelcomeBanner(page, "/bn");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
  await page.getByRole("button", { name: "মেনু" }).click();
  const panel = page.locator("#mobile-menu");
  await expect(panel.getByRole("link", { name: "ঠেকের আড্ডা" })).toBeVisible();
  await expect(panel.getByRole("link", { name: "ক্যালেন্ডার" })).toBeVisible();
  const scrolls = await panel.evaluate((el) => el.scrollHeight > el.clientHeight);
  expect(scrolls).toBe(false);
  await panel.getByRole("link", { name: "ক্যালেন্ডার" }).click();
  await expect(page).toHaveURL(/\/bn\/calendar$/);
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});

test("language switcher navigates between Bengali and English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A Bengali digital home");
});

test("discover is an on-brand 'coming soon' placeholder", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/discover");
  await expect(page.getByText("শীঘ্রই আসছে", { exact: true })).toBeVisible();
});
