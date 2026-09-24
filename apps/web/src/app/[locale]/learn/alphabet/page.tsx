import { setRequestLocale } from "next-intl/server";
import { AlphabetChart } from "@/components/learn/AlphabetChart";

export default async function AlphabetPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <AlphabetChart />;
}
