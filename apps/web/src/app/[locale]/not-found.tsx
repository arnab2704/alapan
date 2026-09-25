import { useTranslations } from "next-intl";
import { Container } from "@alapon/ui";
import { Link } from "@/i18n/navigation";

/** Shown for any unknown address under a locale, inside the normal site chrome. */
export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container className="max-w-xl py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-2 text-4xl">{t("title")}</h1>
      <p className="reading mt-3 text-ink-700 dark:text-ink-100">{t("body")}</p>
      <p className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/today" className="btn btn-primary">
          {t("today")}
        </Link>
        <Link href="/" className="btn btn-secondary">
          {t("home")}
        </Link>
      </p>
    </Container>
  );
}
