import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bn", "en"],
  defaultLocale: "bn",
  localePrefix: "always",
  // Alapon is Bengali-first: "/" always lands on "/bn" rather than guessing
  // from the browser's Accept-Language header. Users switch explicitly.
  localeDetection: false
});

export type AppLocale = (typeof routing.locales)[number];
