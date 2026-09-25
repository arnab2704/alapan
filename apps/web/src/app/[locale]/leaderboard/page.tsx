import { setRequestLocale } from "next-intl/server";
import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("leaderboard", locale);

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <LeaderboardPage />;
}
