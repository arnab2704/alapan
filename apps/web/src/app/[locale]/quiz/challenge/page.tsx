import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildChallengeQuery, parseChallenge } from "@alapon/game-engine";
import { Container } from "@alapon/ui";
import { ChallengePlayer } from "@/components/quiz/ChallengePlayer";
import { Link } from "@/i18n/navigation";

type Props = {
  params: { locale: string };
  searchParams: { d?: string; s?: string; n?: string };
};

export async function generateMetadata({ params: { locale }, searchParams }: Props): Promise<Metadata> {
  const challenge = parseChallenge(searchParams, new Date());
  const t = await getTranslations({ locale, namespace: "challenge" });
  if (!challenge) return { title: t("invalidTitle") };
  const name = challenge.name ?? t("aFriend");
  return {
    title: t("title", { name }),
    description: t("shareDescription"),
    openGraph: {
      title: t("title", { name }),
      description: t("shareDescription"),
      images: [`/api/og?${buildChallengeQuery(challenge)}&l=${locale}`]
    },
    twitter: { card: "summary_large_image" }
  };
}

export default async function ChallengePage({ params: { locale }, searchParams }: Props) {
  setRequestLocale(locale);
  const challenge = parseChallenge(searchParams, new Date());
  if (!challenge) {
    const t = await getTranslations("challenge");
    return (
      <Container className="max-w-xl py-14 text-center">
        <p role="alert" className="text-lg">
          {t("invalid")}
        </p>
        <Link href="/quiz/daily" className="mt-4 inline-block font-semibold text-sindoor-600 underline">
          {t("playToday")}
        </Link>
      </Container>
    );
  }
  return <ChallengePlayer challenge={challenge} />;
}
