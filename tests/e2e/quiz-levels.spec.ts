import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

interface ApiQuestion {
  correctIndex: number;
  options: unknown[];
}

async function fetchSet(page: Page, level: number, set: number): Promise<ApiQuestion[]> {
  const response = await page.request.get(`/api/quiz/set/${level}/${set}`);
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { questions: ApiQuestion[] }).questions;
}

/** Plays a whole set, picking the correct option (or, when `correct` is false, a wrong one) for every question. */
async function playSet(page: Page, level: number, set: number, correct: boolean) {
  const questions = await fetchSet(page, level, set);
  await page.goto(`/bn/quiz/level/${level}/${set}`);
  for (const question of questions) {
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(4);
    const pick = correct ? question.correctIndex : (question.correctIndex + 1) % 4;
    await radios.nth(pick).click();
    await page.getByRole("button", { name: /পরের প্রশ্ন|ফলাফল দেখুন/ }).click();
  }
}

test("the quiz hub offers the daily quiz and ten levels, with only Level 1 open on a fresh profile", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz");

  await expect(page.getByRole("link", { name: "আজকের কুইজ খেলুন" })).toBeVisible();
  await expect(page.getByRole("link", { name: "যাত্রা শুরু করুন" })).toBeVisible();

  const levels = page.getByRole("listitem").filter({ hasText: /লেভেল [০-৯]+/ });
  await expect(levels).toHaveCount(10);
  await expect(levels.first().getByRole("link")).toBeVisible();
  await expect(levels.nth(1).getByRole("link")).toHaveCount(0);
  await expect(levels.nth(1)).toContainText("তালাবদ্ধ");
});

test("level 1 lists ten sets with only the first playable", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/level/1");
  await expect(page.getByRole("heading", { name: "নবীন" })).toBeVisible();

  await expect(page.getByRole("link", { name: "সেট ১", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "সেট ২", exact: true })).toHaveCount(0);
  await expect(page.getByRole("listitem").filter({ hasText: /সেট [০-৯]+/ })).toHaveCount(10);
});

test("passing a set unlocks the next and records the best score", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/level/1");
  await playSet(page, 1, 1, true);

  await expect(page.getByText("উত্তীর্ণ! পরের সেট খুলে গেছে।")).toBeVisible();
  await expect(page.getByRole("link", { name: "পরের সেট" })).toBeVisible();

  await page.goto("/bn/quiz/level/1");
  await expect(page.getByRole("link", { name: "সেট ২", exact: true })).toBeVisible();
  await expect(page.getByText("উত্তীর্ণ", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/সেরা: [০-৯]+\/[০-৯]+/).first()).toBeVisible();

  // The hub now resumes from set 2 rather than starting over.
  await page.goto("/bn/quiz");
  await expect(page.getByRole("link", { name: "চালিয়ে যান" })).toHaveAttribute("href", "/bn/quiz/level/1/2");
});

test("failing a set keeps the next one locked and offers a retry", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/level/1");
  await playSet(page, 1, 1, false);

  await expect(page.getByText("উত্তীর্ণ হতে ৭০% সঠিক দরকার - আবার চেষ্টা করুন।")).toBeVisible();
  await expect(page.getByRole("link", { name: "পরের সেট" })).toHaveCount(0);

  await page.getByRole("button", { name: "আবার চেষ্টা করুন" }).click();
  await expect(page.getByRole("radio")).toHaveCount(4);

  await page.goto("/bn/quiz/level/1");
  await expect(page.getByRole("link", { name: "সেট ২", exact: true })).toHaveCount(0);
});

test("a locked set cannot be played by URL", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/level/2/1");
  await expect(page.getByRole("heading", { name: "এই সেট এখনো বন্ধ" })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(0);
});

test("the level API serves shuffled questions and rejects unknown sets", async ({ page }) => {
  const questions = await fetchSet(page, 3, 4);
  expect(questions.length).toBeGreaterThanOrEqual(10);
  expect(questions.every((q) => q.options.length === 4)).toBe(true);

  expect((await page.request.get("/api/quiz/set/11/1")).status()).toBe(404);
  expect((await page.request.get("/api/quiz/set/1/0")).status()).toBe(404);
  expect((await page.request.get("/api/quiz/set/abc/1")).status()).toBe(404);
});

test("the level quiz translates to English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/en/quiz");
  await expect(page.getByRole("heading", { name: "Quiz", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start the journey" })).toBeVisible();

  await page.goto("/en/quiz/level/1/1");
  await expect(page.getByRole("heading", { name: "Level 1 · Set 1" })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(4);
});

test("playing a level set produces no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await gotoWithoutWelcomeBanner(page, "/bn/quiz");
  await playSet(page, 1, 1, true);
  await page.goto("/bn/quiz/level/1");
  await page.goto("/bn/quiz");

  expect(errors).toEqual([]);
});
