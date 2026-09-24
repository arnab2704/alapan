import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  // The dev server compiles each page on first visit, which can take several seconds under parallel load.
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev -w apps/web",
    url: "http://localhost:3000/bn",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
