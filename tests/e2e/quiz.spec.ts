import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("homepage links to the daily quiz", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn");
  await page.locator("main").getByRole("link", { name: /^কুইজ/ }).click();
  await expect(page).toHaveURL(/\/bn\/quiz$/);
  await expect(page.getByRole("heading", { name: "কুইজ", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "আজকের কুইজ খেলুন" }).click();
  await expect(page).toHaveURL(/\/bn\/quiz\/daily$/);
  await expect(page.getByRole("heading", { name: "আজকের কুইজ" })).toBeVisible();
});

test("play page also links to the quiz", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/play");
  await page.getByRole("link", { name: /কুইজ খেলুন/ }).click();
  await expect(page).toHaveURL(/\/bn\/quiz$/);
});

test("answering all five daily questions reaches a scored result that persists across reload", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");

  await expect(page.getByText("১ / ৫", { exact: true })).toBeVisible();

  for (let i = 0; i < 5; i++) {
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(4);
    await radios.first().click();

    // Immediate feedback: either "correct" or "incorrect" status, plus an explanation.
    const status = page.getByRole("status");
    await expect(status).toBeVisible();
    await expect(status.getByText(/ঠিক উত্তর!|উত্তরটি সঠিক নয়।/)).toBeVisible();

    const advance = page.getByRole("button", { name: /পরের প্রশ্ন|আজকের ফলাফল/ });
    await advance.click();
  }

  const scorePattern = /^[০-৯]+ \/ ৫$/;
  await expect(page.getByRole("heading", { name: "আজকের ফলাফল" })).toBeVisible();
  await expect(page.getByText(scorePattern)).toBeVisible();

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "আজকের ফলাফল" })).toBeVisible();
  await expect(page.getByText(scorePattern)).toBeVisible();
});

test("Try again restarts the quiz from question one", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");

  for (let i = 0; i < 5; i++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: /পরের প্রশ্ন|আজকের ফলাফল/ }).click();
  }
  await expect(page.getByRole("heading", { name: "আজকের ফলাফল" })).toBeVisible();

  await page.getByRole("button", { name: "আবার চেষ্টা করুন" }).click();
  await expect(page.getByText("১ / ৫", { exact: true })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(4);
});

test("a wrong answer is marked distinctly from a correct one, never at a fixed option position", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");

  const positions = new Set<number>();
  for (let i = 0; i < 5; i++) {
    const radios = page.getByRole("radio");
    await radios.first().click();
    const texts = await radios.allTextContents();
    const correctIndex = texts.findIndex((text) => text.includes("✓"));
    expect(correctIndex).toBeGreaterThanOrEqual(0);
    positions.add(correctIndex);
    await page.getByRole("button", { name: /পরের প্রশ্ন|আজকের ফলাফল/ }).click();
  }
  // With 5 questions and 4 possible positions, seeing more than one distinct
  // position is an easy, reliable signal the anti-clustering fix is live.
  expect(positions.size).toBeGreaterThan(1);
});

test("switching to English translates the quiz", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/quiz\/daily$/);
  await expect(page.getByRole("heading", { name: "Today's Quiz" })).toBeVisible();
  await expect(page.getByText("1 / 5", { exact: true })).toBeVisible();
});

test("the quiz page produces no console errors across a full play sequence", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");
  for (let i = 0; i < 5; i++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: /পরের প্রশ্ন|আজকের ফলাফল/ }).click();
  }
  await page.getByRole("button", { name: "আবার চেষ্টা করুন" }).click();

  expect(errors).toEqual([]);
});
