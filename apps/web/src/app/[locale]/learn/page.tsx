import { setRequestLocale } from "next-intl/server";
import { LearnHome } from "@/components/learn/LearnHome";

export default async function LearnPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <LearnHome />;
}
