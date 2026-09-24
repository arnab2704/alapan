"use client";

import { useLocale } from "next-intl";
import { LanguageSwitcher } from "@alapon/ui";
import { usePathname, useRouter } from "@/i18n/navigation";
import { announceNavigationStart } from "@/lib/navigationProgress";

export function LocaleSwitcher() {
  const locale = useLocale() as "bn" | "en";
  const pathname = usePathname();
  const router = useRouter();

  return (
    <LanguageSwitcher
      current={locale}
      onSelect={(next) => {
        if (next !== locale) announceNavigationStart();
        router.replace(pathname, { locale: next });
      }}
    />
  );
}
