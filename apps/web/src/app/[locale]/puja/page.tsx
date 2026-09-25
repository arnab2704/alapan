import { setRequestLocale } from "next-intl/server";
import { PujaHub } from "@/components/puja/PujaHub";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("puja", locale);

export default async function PujaPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <PujaHub />;
}
