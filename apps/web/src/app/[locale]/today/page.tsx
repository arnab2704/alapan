import { setRequestLocale } from "next-intl/server";
import { TodayPageContent } from "@/components/today/TodayPageContent";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("today", locale);

export default async function TodayPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <TodayPageContent />;
}
