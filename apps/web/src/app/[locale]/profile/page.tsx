import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProfilePage } from "@/components/profile/ProfilePage";

export const metadata: Metadata = { robots: { index: false } };

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <ProfilePage />;
}
