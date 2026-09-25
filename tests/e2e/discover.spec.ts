import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

const slug = (w: string) => encodeURIComponent(w);

test("the Discover hub shows today's discovery and filters by kind and by search", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/discover");
  await expect(page.getByRole("heading", { name: "বাংলা আবিষ্কার", level: 1 })).toBeVisible();
  await expect(page.getByText("আজকের আবিষ্কার", { exact: true })).toBeVisible();

  const filter = page.getByRole("group", { name: "ধরন" });
  await filter.getByRole("button", { name: "খাবার" }).click();
  await expect(page.getByRole("link", { name: /রসগোল্লা/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /শান্তিনিকেতন/ })).toHaveCount(0);

  await filter.getByRole("button", { name: "সব" }).click();
  await page.getByRole("searchbox").fill("শান্তিনিকেতন");
  await expect(page.getByRole("link", { name: /শান্তিনিকেতন/ }).first()).toBeVisible();
  await page.getByRole("searchbox").fill("zzzzzq");
  await expect(page.getByRole("status")).toContainText("কিছু পাওয়া যায়নি");
});

test("a discovery connects to words, other discoveries and a play-with-these-words exercise", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/discover/kumartuli");
  await expect(page.getByRole("heading", { name: "কুমোরটুলি", level: 1 })).toBeVisible();
  await expect(page.getByText("সূত্র:")).toBeVisible();

  // Words of the subject link to Word DNA.
  await expect(page.getByRole("link", { name: "মূর্তি", exact: true })).toHaveAttribute(
    "href",
    `/bn/word/${slug("মূর্তি")}`
  );
  // A related discovery links onward (Kumartuli <-> Mahalaya, both ways).
  await expect(page.getByRole("link", { name: /মহালয়া/ }).first()).toBeVisible();

  // Play: rebuild the first related word from its tiles.
  const practice = page.getByRole("region", { name: "এই বিষয়ের শব্দ খেলুন" });
  await expect(practice).toBeVisible();
  await expect(practice.getByRole("group", { name: "অক্ষর-খণ্ড" }).getByRole("button").first()).toBeVisible();
});

test("opening discoveries fills the passport: a place counts under places", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/discover/santiniketan");
  await gotoWithoutWelcomeBanner(page, "/bn/passport");
  const places = page
    .getByRole("listitem")
    .filter({ has: page.getByText("স্থান", { exact: true }) })
    .first();
  await expect(places).toContainText("১");
});

test("discovery pages work in English and unknown ones are a real 404", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/en/discover/ilish");
  await expect(page.getByRole("heading", { name: "Ilish (hilsa)", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Words of this subject" })).toBeVisible();
  const response = await page.goto("/bn/discover/no-such-thing");
  expect(response?.status()).toBe(404);
});

test("the Today page and search lead into Discover", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/search");
  await page.getByRole("searchbox").fill("rasgulla");
  await page
    .getByRole("link", { name: /রসগোল্লা/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/bn\/discover\/rasgulla$/);
});

test("Today's Adda prompt is offered on the Adda page when the community backend is available", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/theke-adda?prompt=today");
  const unavailable = page.getByRole("alert").filter({ hasText: /এখন|উপলব্ধ|চালু/ });
  if (await unavailable.count()) test.skip(true, "community backend not configured");
  await expect(page.getByText("আজকের আড্ডা", { exact: true }).first()).toBeVisible();
});

test("a festival page shows its days, links to the Puja passport and 404s for unknown festivals", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/festival/durga-puja-2026");
  await expect(page.getByRole("heading", { name: /দুর্গাপূজা/, level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "দিনগুলি" })).toBeVisible();
  await expect(page.getByRole("link", { name: "পুজো পাসপোর্ট" })).toHaveAttribute("href", "/bn/puja");
  const response = await page.goto("/bn/festival/nope");
  expect(response?.status()).toBe(404);
});
