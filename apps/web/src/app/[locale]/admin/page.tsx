import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AdminPage } from "@/components/admin/AdminPage";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function Admin({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <AdminPage />;
}
