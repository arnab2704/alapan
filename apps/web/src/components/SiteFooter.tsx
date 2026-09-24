import { useTranslations } from "next-intl";
import { Container, AlponaDivider } from "@alapon/ui";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-ink-100 pt-2 text-sm text-ink-400 dark:border-ink-700">
      <AlponaDivider className="mx-auto h-3 w-full max-w-xs text-alpona-200 dark:text-ink-700" />
      <Container className="flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
        <p className="font-bengaliDisplay text-ink-500 dark:text-ink-300">
          আলাপন <span className="font-latin text-ink-400">Alapon</span> &copy; {year}. {t("rights")}
        </p>
      </Container>
    </footer>
  );
}
