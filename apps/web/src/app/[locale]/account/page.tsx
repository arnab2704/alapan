import { setRequestLocale } from "next-intl/server";
import { AccountPage } from "@/components/auth/AccountPage";

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <AccountPage />;
}
