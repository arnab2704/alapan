import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, Container, SectionHeading, Badge, AlponaDivider } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { HomeCalendarWidget } from "@/components/calendar/HomeCalendarWidget";
import { HomeDailyQuiz } from "@/components/quiz/HomeDailyQuiz";
import { HomeEditorial } from "@/components/home/HomeEditorial";

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-marigold-50 via-cream-50 to-cream-50 py-14 dark:border-ink-700 dark:from-ink-800 dark:via-ink-900 dark:to-ink-900 sm:py-20">
        <Container className="relative flex flex-col items-start gap-5">
          <Badge tone="festival">{t("tagline")}</Badge>
          <h1 className="font-bengaliDisplay text-4xl font-extrabold leading-tight text-ink-900 dark:text-ink-50 sm:text-5xl md:text-6xl">
            {t("heading")}
          </h1>
          <p className="max-w-xl text-lg text-ink-600 dark:text-ink-200">{t("description")}</p>
          <Link
            href="/play/shobdoshakti"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-sindoor-500 px-6 text-lg font-medium text-white shadow-sm shadow-sindoor-900/20 transition-colors hover:bg-sindoor-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sindoor-600"
          >
            {t("cta")}
          </Link>
        </Container>
        <AlponaDivider className="absolute inset-x-0 bottom-0 h-3 w-full text-alpona-300/60 dark:text-ink-700" />
      </section>

      <HomeDailyQuiz />

      <HomeEditorial />

      <HomeCalendarWidget />

      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading title={t("featuresHeading")} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/learn" className="block">
              <Card className="h-full border-t-4 border-t-shapla-500 transition-shadow hover:shadow-md">
                <h3 className="font-bengaliDisplay text-lg font-semibold">{t("learnTitle")}</h3>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{t("learnDescription")}</p>
              </Card>
            </Link>
            <Link href="/play/shobdoshakti" className="block">
              <Card className="h-full border-t-4 border-t-sindoor-400 transition-shadow hover:shadow-md">
                <h3 className="font-bengaliDisplay text-lg font-semibold">{t("shobdoshaktiTitle")}</h3>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{t("shobdoshaktiDescription")}</p>
              </Card>
            </Link>
            <Link href="/quiz" className="block">
              <Card className="h-full border-t-4 border-t-sindoor-300 transition-shadow hover:shadow-md">
                <h3 className="font-bengaliDisplay text-lg font-semibold">{t("quizTitle")}</h3>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{t("quizDescription")}</p>
              </Card>
            </Link>
            <Link href="/discover" className="block">
              <Card className="h-full border-t-4 border-t-marigold-400 transition-shadow hover:shadow-md">
                <h3 className="font-bengaliDisplay text-lg font-semibold">{t("discoverTitle")}</h3>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{t("discoverDescription")}</p>
              </Card>
            </Link>
            <Link href="/theke-adda" className="block">
              <Card className="h-full border-t-4 border-t-shapla-400 transition-shadow hover:shadow-md">
                <h3 className="font-bengaliDisplay text-lg font-semibold">{t("addaTitle")}</h3>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">{t("addaDescription")}</p>
              </Card>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
