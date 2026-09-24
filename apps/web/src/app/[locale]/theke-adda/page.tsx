import { setRequestLocale } from "next-intl/server";
import { AddaHome } from "@/components/adda/AddaHome";

export default async function ThekeAddaPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <AddaHome />;
}
