import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SearchPage } from "@/components/search/SearchPage";

export const metadata: Metadata = { robots: { index: false } };

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <SearchPage />;
}
