import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";

export default async function PlayPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("play");
  const home = await getTranslations("home");

  return (
    <Container className="py-12">
      <SectionHeading title={t("heading")} description={t("description")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/play/shobdoshakti">
          <Card className="h-full border-t-4 border-t-sindoor-400 transition-shadow hover:shadow-md">
            <h3 className="font-bengaliDisplay text-lg font-semibold">{home("shobdoshaktiTitle")}</h3>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{home("shobdoshaktiDescription")}</p>
            <p className="mt-4 text-sm font-medium text-sindoor-600">{t("shobdoshaktiCta")} &rarr;</p>
          </Card>
        </Link>
        <Link href="/quiz">
          <Card className="h-full border-t-4 border-t-sindoor-300 transition-shadow hover:shadow-md">
            <h3 className="font-bengaliDisplay text-lg font-semibold">{home("quizTitle")}</h3>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{home("quizDescription")}</p>
            <p className="mt-4 text-sm font-medium text-sindoor-600">{t("quizCta")} &rarr;</p>
          </Card>
        </Link>
      </div>
    </Container>
  );
}
