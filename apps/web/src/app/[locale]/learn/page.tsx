import { setRequestLocale } from "next-intl/server";
import { LearnHome } from "@/components/learn/LearnHome";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("learn", locale);

export default async function LearnPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <LearnHome />;
}
