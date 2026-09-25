import { setRequestLocale } from "next-intl/server";
import { AddaHome } from "@/components/adda/AddaHome";
import { metaFor } from "@/lib/pageMetadata";

export const generateMetadata = ({ params: { locale } }: { params: { locale: string } }) =>
  metaFor("adda", locale);

export default async function ThekeAddaPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <AddaHome />;
}
