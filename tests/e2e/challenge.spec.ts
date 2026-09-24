import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("a challenge link shows the friend's score and can be played to a comparison", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/challenge?d=2026-09-20&s=3&n=Priya");
  await expect(page.getByRole("heading", { name: "Priya আপনাকে চ্যালেঞ্জ করেছেন!" })).toBeVisible();
  await expect(page.getByText("৩/৫", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "চ্যালেঞ্জ নিন" }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: /পরের প্রশ্ন|ফলাফল/ }).click();
  }
  await expect(page.getByText(/আপনি [০-৯] - Priya ৩ \(মোট ৫\)/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /আপনি জিতেছেন!|সমান সমান!|এবার হলো না/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "ফলাফল শেয়ার করুন" })).toBeVisible();
});

test("the same challenge date always serves the same questions", async ({ page }) => {
  const firstQuestion = async () => {
    await gotoWithoutWelcomeBanner(page, "/en/quiz/challenge?d=2026-09-20&s=2");
    await page.getByRole("button", { name: "Accept the challenge" }).click();
    await expect(page.getByRole("radio").first()).toBeVisible();
    return page.locator("main").innerText();
  };
  const a = await firstQuestion();
  const b = await firstQuestion();
  expect(a).toBe(b);
});

test("invalid or tampered challenge links show a friendly message", async ({ page }) => {
  for (const query of ["d=2026-09-20&s=9", "d=2099-01-01&s=3", "d=nonsense&s=3", "s=3", ""]) {
    await gotoWithoutWelcomeBanner(page, `/bn/quiz/challenge?${query}`);
    await expect(page.getByText("এই চ্যালেঞ্জ লিংকটি সঠিক নয়।")).toBeVisible();
  }
});

test("challenge names are shown as plain text, never as markup", async ({ page }) => {
  await gotoWithoutWelcomeBanner(
    page,
    "/en/quiz/challenge?d=2026-09-20&s=3&n=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E"
  );
  await expect(page.locator("main img")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /challenged you!/ })).toBeVisible();
});

test("finishing the daily quiz offers a Wordle-style share with a challenge link", async ({
  page,
  context
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");
  for (let i = 0; i < 5; i++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: /পরের প্রশ্ন|আজকের ফলাফল/ }).click();
  }
  await page.getByRole("button", { name: "ফলাফল শেয়ার করুন" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/আলাপন কুইজ/);
  expect(copied).toMatch(/[🟩🟥]{5} [০-৯]\/৫/u);
  expect(copied).toContain("/bn/quiz/challenge?d=");
});

test("the link-preview image is served as a PNG", async ({ request }) => {
  const res = await request.get("/api/og?d=2026-09-20&s=4&l=bn");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
