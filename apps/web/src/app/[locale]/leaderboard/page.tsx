import { setRequestLocale } from "next-intl/server";
import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage";

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <LeaderboardPage />;
}
