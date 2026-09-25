import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

const slug = (w: string) => encodeURIComponent(w);

test("a curated word shows its structure, meaning, sound, kin, story and lets you practise it", async ({
  page
}) => {
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("নদী")}`);
  await expect(page.getByRole("heading", { name: "নদী", level: 1 })).toBeAttached();
  await expect(page.getByText("গঠন:")).toContainText("ন + দী");
  await expect(
    page.locator(`section[aria-labelledby="dna-meaning"]`).getByText("স্রোতস্বিনী জলধারা")
  ).toBeVisible();
  await expect(page.getByText("nodi", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /কঠিনতা: ৫-এর মধ্যে ১/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "জল", exact: true })).toHaveAttribute(
    "href",
    `/bn/word/${slug("জল")}`
  );
  await expect(page.getByRole("heading", { name: "শব্দের গল্প" })).toBeVisible();

  // Practise: rebuild the word from its tiles.
  const practice = page.locator("#practice-heading").locator("xpath=ancestor::section");
  await practice
    .getByRole("group", { name: "অক্ষর-খণ্ড" })
    .getByRole("button", { name: "ন", exact: true })
    .click();
  await practice
    .getByRole("group", { name: "অক্ষর-খণ্ড" })
    .getByRole("button", { name: "দী", exact: true })
    .click();
  await practice.getByRole("button", { name: "যাচাই করুন" }).click();
  await expect(practice.getByRole("status")).toContainText("চমৎকার!");
});

test("a word can be saved and stays saved", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("আকাশ")}`);
  await page.getByRole("button", { name: "শব্দটি সংরক্ষণ করুন" }).click();
  await expect(page.getByRole("button", { name: /সংরক্ষিত/ })).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: /সংরক্ষিত/ })).toBeVisible();
});

test("a word without a curated meaning still shows its structure, honestly", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("তভ")}`);
  await expect(page.getByText("এই শব্দটির অর্থ এখনও আমাদের সংগ্রহে নেই")).toBeVisible();
  await expect(page.getByText("গঠন:")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the word page explains why it is shown, especially after a game", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, `/bn/word/${slug("নদী")}?from=game`);
  await expect(page.getByText(/আজকের ShobdoShakti-তে আপনি এই শব্দটি খুঁজে পেয়েছেন/)).toBeVisible();
});

test("non-Bengali or oversized word addresses are a real 404 with the branded page", async ({ page }) => {
  for (const path of ["/bn/word/hello", `/bn/word/${slug("ক".repeat(40))}`]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "পাতাটি পাওয়া যায়নি" })).toBeVisible();
  }
});

test("search leads to a word's page", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/search");
  await page.getByRole("searchbox").fill("river");
  await page.getByRole("link", { name: /নদী/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/bn/word/${slug("নদী")}$`));
});

test("the word page works in English", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, `/en/word/${slug("নদী")}`);
  await expect(page.getByRole("heading", { name: "Meaning" })).toBeVisible();
  await expect(page.getByText("a river", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Save this word" })).toBeVisible();
});
