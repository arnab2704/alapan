import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test.describe("legal and safety pages", () => {
  for (const [path, heading] of [
    ["/bn/terms", "ব্যবহারের শর্তাবলি"],
    ["/bn/privacy", "গোপনীয়তা নীতি"],
    ["/bn/copyright-policy", "কপিরাইট নীতি"],
    ["/bn/safety", "নিরাপত্তা ও কমিউনিটি নির্দেশিকা"],
    ["/en/terms", "Terms of Service"],
    ["/en/privacy", "Privacy Notice"]
  ]) {
    test(`${path} renders`, async ({ page }) => {
      await gotoWithoutWelcomeBanner(page, path);
      await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    });
  }

  test("the footer links every policy and the copyright report form", async ({ page }) => {
    await gotoWithoutWelcomeBanner(page, "/en");
    const legal = page.getByRole("navigation", { name: "Legal" });
    for (const name of ["Terms", "Privacy", "Copyright", "Report copyright", "Safety"]) {
      await expect(legal.getByRole("link", { name, exact: true })).toBeVisible();
    }
    await legal.getByRole("link", { name: "Report copyright" }).click();
    await expect(page).toHaveURL(/\/en\/report-copyright$/);
    await expect(page.getByLabel("Your name")).toBeVisible();
    await expect(page.getByLabel(/Address \(URL\)/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit claim" })).toBeVisible();
  });
});

test("admin is gated for signed-out visitors", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/en/admin");
  await expect(page.getByText("This page is for admins only.")).toBeVisible();
});

test("the app is installable and ships security headers", async ({ page, request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBeTruthy();
  expect((await manifest.json()).short_name).toBe("আলাপন");

  const response = await page.goto("/bn");
  const headers = response?.headers() ?? {};
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["referrer-policy"]).toBeTruthy();
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("the sitemap lists the policy pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/bn/terms");
  expect(xml).toContain("/en/privacy");
});

test("Discover covers cinema, theatre, art, science, traditions and education", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/discover");
  const filter = page.getByRole("group", { name: "ধরন" });
  for (const label of ["সিনেমা", "নাটক", "শিল্প", "বিজ্ঞান", "ঐতিহ্য", "শিক্ষা"]) {
    await expect(filter.getByRole("button", { name: label })).toBeVisible();
  }
  await filter.getByRole("button", { name: "সিনেমা" }).click();
  await expect(page.getByRole("link", { name: /পথের পাঁচালী/ }).first()).toBeVisible();
  await gotoWithoutWelcomeBanner(page, "/bn/discover/kalighat-pat");
  await expect(page.getByRole("heading", { name: "কালীঘাটের পট", level: 1 })).toBeVisible();
});
