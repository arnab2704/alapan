import { setRequestLocale } from "next-intl/server";
import { TodayPageContent } from "@/components/today/TodayPageContent";

export default async function TodayPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <TodayPageContent />;
}
