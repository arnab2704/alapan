import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <LoginForm />;
}
