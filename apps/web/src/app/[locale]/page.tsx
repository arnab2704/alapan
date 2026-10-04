import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlponaDivider, Container } from "@alapon/ui";
import { Daily5Tracker } from "@/components/daily5/Daily5Tracker";
import { HomeContinue } from "@/components/home/HomeContinue";
import { HomeWordAndDiscover } from "@/components/home/HomeDiscover";
import { FestiveCta } from "@/components/home/FestiveCta";
import { HomeEditorial } from "@/components/home/HomeEditorial";
import { HomeHeroMedia } from "@/components/home/HomeHeroMedia";
import { HomeToday } from "@/components/home/HomeToday";
import { TodayAdda } from "@/components/today/TodaySections";
import { Link } from "@/i18n/navigation";

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("homePage");

  return (
    <div>
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 md:min-h-[480px] lg:min-h-[560px] xl:min-h-[640px]">
        <HomeHeroMedia />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-cream-50 via-cream-50/85 to-cream-50/10 dark:from-ink-900 dark:via-ink-900/85 dark:to-ink-900/30 md:block"
        />
        <Container className="relative">
          <p className="font-latin text-sm font-semibold tracking-[0.3em] text-alpona-700 dark:text-alpona-300 md:block">
            ALAPON
          </p>
          <p className="font-bengaliDisplay mt-1 text-2xl font-bold text-ink-500 dark:text-ink-300">আলাপন</p>
          <h1 className="display mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl md:text-6xl">
            {t("promise")}
          </h1>
          <p className="reading mt-5 max-w-xl text-lg text-ink-700 dark:text-ink-100">{t("lines")}</p>
          <p className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/today" className="btn btn-primary btn-lg">
              {t("ctaToday")}
            </Link>
            <Link href="/play/shobdoshakti" className="btn btn-secondary btn-lg">
              {t("ctaPlay")}
            </Link>
            <FestiveCta />
          </p>
        </Container>
        <AlponaDivider className="absolute inset-x-0 bottom-0 hidden h-3 w-full text-alpona-300/60 dark:text-ink-700 md:block" />
      </section>

      <HomeToday />

      <section className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          <Daily5Tracker variant="home" />
        </Container>
      </section>

      <HomeContinue />

      <HomeWordAndDiscover />

      <HomeEditorial />

      <section
        aria-labelledby="home-play-heading"
        className="border-b border-ink-100 py-10 dark:border-ink-700 sm:py-14"
      >
        <Container>
          <p className="eyebrow">{t("play.eyebrow")}</p>
          <h2 id="home-play-heading" className="display mt-2 text-3xl sm:text-4xl">
            {t("play.heading")}
          </h2>
          <p className="mt-1 text-ink-600 dark:text-ink-200">{t("play.description")}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Link href="/play/shobdoshakti" className="card-game group block">
              <p className="eyebrow">{t("play.dailyEyebrow")}</p>
              <p className="display mt-1 text-3xl">{t("play.dailyTitle")}</p>
              <p className="reading mt-2 text-ink-700 dark:text-ink-100">{t("play.dailyDescription")}</p>
              <span className="btn btn-primary mt-4">{t("play.dailyCta")}</span>
            </Link>
            <div className="grid gap-4">
              <Link href="/play/shobdoshakti" className="card-game block">
                <p className="display text-xl">{t("play.modesTitle")}</p>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("play.modesDescription")}</p>
              </Link>
              <Link href="/quiz" className="card-game block">
                <p className="display text-xl">{t("play.quizTitle")}</p>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("play.quizDescription")}</p>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="home-learn-heading" className="py-10 sm:py-14">
        <Container>
          <div className="card-learning grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow">{t("learn.eyebrow")}</p>
              <h2 id="home-learn-heading" className="display mt-2 text-3xl sm:text-4xl">
                {t("learn.heading")}
              </h2>
              <p className="reading mt-2 text-ink-700 dark:text-ink-100">{t("learn.description")}</p>
              <p className="mt-4">
                <Link href="/learn" className="btn btn-primary">
                  {t("learn.cta")}
                </Link>
              </p>
            </div>
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {(["alphabet", "words", "conjuncts", "numbers"] as const).map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-cream-50 px-4 py-2 text-sm font-semibold text-ink-700 dark:bg-ink-900 dark:text-ink-100"
                >
                  {t(`learn.chips.${chip}`)}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-4 sm:py-8">
        <Container className="max-w-3xl">
          <TodayAdda />
        </Container>
      </section>
    </div>
  );
}
