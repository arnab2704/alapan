import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("the Today page leads with the date and a Daily 5 that fills in as you take part", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/today");
  await expect(page.getByRole("heading", { name: "আজকের ৫", level: 2 })).toBeVisible();
  const progress = page.locator("#daily5").getByRole("status");
  await expect(progress).toHaveAttribute("aria-label", "৫টির মধ্যে ০টি সম্পন্ন");

  // 1. word of the day
  await page.getByRole("button", { name: "অর্থ দেখুন" }).click();
  await expect(progress).toHaveAttribute("aria-label", "৫টির মধ্যে ১টি সম্পন্ন");
  // 3. question
  await page.locator("#question").getByRole("group").getByRole("button").first().click();
  await expect(progress).toHaveAttribute("aria-label", "৫টির মধ্যে ২টি সম্পন্ন");
  // 5. learning
  await page.locator("#learn").getByRole("group").getByRole("button").first().click();
  await expect(progress).toHaveAttribute("aria-label", "৫টির মধ্যে ৩টি সম্পন্ন");
  // 4. discovery
  await page.getByRole("button", { name: "পড়লাম" }).click();
  await expect(progress).toHaveAttribute("aria-label", "৫টির মধ্যে ৪টি সম্পন্ন");

  // Progress survives a reload, and the word stays open.
  await page.reload();
  await expect(page.locator("#daily5").getByRole("status")).toHaveAttribute(
    "aria-label",
    "৫টির মধ্যে ৪টি সম্পন্ন"
  );
  await expect(page.getByRole("button", { name: "অর্থ দেখুন" })).toHaveCount(0);
});

test("the Today page works in English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/en/today");
  await expect(page.getByRole("heading", { name: "Today's 5", level: 2 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show the meaning" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "One person, one moment from Bengal" })).toBeVisible();
});

test("the Sharodiya hub lists the six Puja days, and the passport stamps and persists", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 9, 18, 10, 0) });
  await gotoWithoutWelcomeBanner(page, "/bn/puja");

  await expect(page.getByRole("heading", { name: "শারদোৎসব ১৪৩৩" })).toBeVisible();
  await expect(page.getByRole("list").first().getByRole("listitem")).toHaveCount(6);
  await expect(page.getByRole("status").first()).toContainText("পুজো চলছে");
  await expect(page.getByText("০/৬ দিনের সিলমোহর")).toBeVisible();

  // Mahalaya, Shashthi and Saptami have arrived by 18 Oct; Ashtami onward are locked.
  const stampButtons = page.getByRole("button", { name: "সিলমোহর লাগান" });
  await expect(stampButtons).toHaveCount(3);
  await expect(page.getByText("দিনটি এলে খুলবে")).toHaveCount(3);

  await stampButtons.first().click();
  await expect(page.getByText("১/৬ দিনের সিলমোহর")).toBeVisible();

  await page.reload();
  await expect(page.getByText("১/৬ দিনের সিলমোহর")).toBeVisible();
});

test("the quiz result offers sharing", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await gotoWithoutWelcomeBanner(page, "/bn/quiz/daily");
  for (let i = 0; i < 5; i++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: /পরের প্রশ্ন|আজকের ফলাফল/ }).click();
  }
  await page.getByRole("button", { name: "ফলাফল শেয়ার করুন" }).click();
  await expect(page.getByText("ফলাফল কপি হয়েছে")).toBeVisible();
});

test("robots.txt and sitemap.xml are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/bn/puja");
});
