import { expect, test } from "@playwright/test";
import { gotoWithoutWelcomeBanner } from "./helpers";

test("the Today page and homepage show today's Bengali date and the next festival", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 8, 23, 12, 0) });
  await gotoWithoutWelcomeBanner(page, "/bn");
  // The session's fixed "today" (23 September 2026) converts to 7 Ashwin 1433.
  await expect(page.getByText("৭ আশ্বিন ১৪৩৩", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /দুর্গাপূজা - আর ১৭ দিন/ })).toBeVisible();

  await gotoWithoutWelcomeBanner(page, "/bn/today");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("৭ আশ্বিন ১৪৩৩");
  await expect(page.getByText("২৩ সেপ্টেম্বর, ২০২৬")).toBeVisible();
  await page.getByRole("link", { name: /দুর্গাপূজা - আর ১৭ দিন/ }).click();
  await expect(page).toHaveURL(/\/bn\/calendar$/);
  await expect(page.getByRole("heading", { name: "শারদীয়া দুর্গাপূজা আসছে" })).toBeVisible();
});

test("calendar page lists a full year of festivals in chronological order with Durga Puja's day schedule", async ({
  page
}) => {
  await page.clock.install({ time: new Date(2026, 8, 23, 12, 0) });
  await gotoWithoutWelcomeBanner(page, "/bn/calendar");

  await expect(page.getByRole("heading", { name: "শারদীয়া দুর্গাপূজা আসছে" })).toBeVisible();
  await expect(page.getByText("পুজোর দিনক্ষণ")).toBeVisible();
  await expect(page.getByText("মহালয়া", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("বিজয়া দশমী", { exact: false }).first()).toBeVisible();

  // The rest of the year, starting with the next festival after Durga Puja.
  await expect(page.getByRole("heading", { name: "কোজাগরী লক্ষ্মীপূজা" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "বিশ্বকর্মা পূজা" })).toBeVisible();
  await expect(page.getByText("তিথি অনুযায়ী", { exact: false })).toBeVisible();
});

test("calendar page shows a normal month-grid calendar, Bengali date leading, that can be navigated", async ({
  page
}) => {
  await page.clock.install({ time: new Date(2026, 8, 23, 12, 0) });
  await gotoWithoutWelcomeBanner(page, "/bn/calendar");

  await expect(page.getByText("মাস ক্যালেন্ডার")).toBeVisible();
  const grid = page.getByRole("grid", { name: "আশ্বিন ১৪৩৩" });
  await expect(grid).toBeVisible();
  // Today (23 Sept 2026 -> 7 Ashwin 1433) is on the grid, marked distinctly.
  await expect(grid.getByRole("gridcell", { name: /৭ আশ্বিন ১৪৩৩ - আজ!/ })).toBeVisible();
  // Durga Puja's opening day (Mahalaya, 10 Oct = 24 Ashwin) is marked with its name.
  await expect(grid.getByRole("gridcell", { name: /২৪ আশ্বিন ১৪৩৩ - দুর্গাপূজা/ })).toBeVisible();

  await page.getByRole("button", { name: "পরের মাস" }).click();
  await expect(page.getByText("কার্তিক ১৪৩৩", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "আগের মাস" }).click();
  await page.getByRole("button", { name: "আগের মাস" }).click();
  await expect(page.getByText("ভাদ্র ১৪৩৩", { exact: false })).toBeVisible();
});

test("switching to English translates calendar content", async ({ page }) => {
  await gotoWithoutWelcomeBanner(page, "/bn/calendar");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/calendar$/);
  await expect(page.getByRole("heading", { name: "Durga Puja is coming" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vishwakarma Puja" })).toBeVisible();
  await expect(page.getByText("Month Calendar")).toBeVisible();
});

test("the calendar pages produce no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await gotoWithoutWelcomeBanner(page, "/bn");
  await gotoWithoutWelcomeBanner(page, "/bn/calendar");
  await page.getByRole("button", { name: "English" }).click();

  expect(errors).toEqual([]);
});
