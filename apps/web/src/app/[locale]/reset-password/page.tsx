import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { robots: { index: false } };

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return <ResetPasswordForm />;
}
