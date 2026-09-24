import { setRequestLocale } from "next-intl/server";
import { CalendarPageContent } from "@/components/calendar/CalendarPageContent";

export default async function CalendarPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <CalendarPageContent />;
}
