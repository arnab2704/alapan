import { setRequestLocale } from "next-intl/server";
import { ModerationQueue } from "@/components/adda/ModerationQueue";

export default async function ModerationPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <ModerationQueue />;
}
