import { setRequestLocale } from "next-intl/server";
import { CalendarPageContent } from "@/components/calendar/CalendarPageContent";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("calendar", locale);

export default async function CalendarPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <CalendarPageContent />;
}
