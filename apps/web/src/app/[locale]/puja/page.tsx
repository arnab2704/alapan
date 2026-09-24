import { setRequestLocale } from "next-intl/server";
import { PujaHub } from "@/components/puja/PujaHub";

export default async function PujaPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <PujaHub />;
}
