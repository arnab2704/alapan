"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toBengaliDigits } from "@alapon/bengali";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import { toLocalIsoDate } from "@/lib/formatDate";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface DailyRow {
  username: string;
  display_name: string;
  score: number;
  total: number;
}
interface TotalRow {
  username: string;
  display_name: string;
  points: number;
  quizzes: number;
}

type Load<T> = { status: "loading" } | { status: "error" } | { status: "ok"; rows: T[] };

export function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const locale = useLocale() as "bn" | "en";
  const toDigits = locale === "bn" ? toBengaliDigits : (n: number) => String(n);
  const { user, enabled } = useAuth();
  const [daily, setDaily] = useState<Load<DailyRow>>({ status: "loading" });
  const [totals, setTotals] = useState<Load<TotalRow>>({ status: "loading" });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const today = toLocalIsoDate(new Date());
    supabase
      .from("daily_leaderboard")
      .select("username, display_name, score, total")
      .eq("day", today)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(20)
      .then(({ data, error }) => setDaily(error ? { status: "error" } : { status: "ok", rows: data ?? [] }));
    supabase
      .from("total_leaderboard")
      .select("username, display_name, points, quizzes")
      .order("points", { ascending: false })
      .limit(20)
      .then(({ data, error }) => setTotals(error ? { status: "error" } : { status: "ok", rows: data ?? [] }));
  }, []);

  function list<T extends { username: string; display_name: string }>(
    state: Load<T>,
    value: (row: T) => string
  ) {
    if (state.status === "loading") return <p className="text-sm text-ink-500">{t("loading")}</p>;
    if (state.status === "error")
      return (
        <p role="alert" className="text-sm text-sindoor-700">
          {t("error")}
        </p>
      );
    if (state.rows.length === 0) return <p className="text-sm text-ink-500">{t("empty")}</p>;
    return (
      <ol className="divide-y divide-ink-100 dark:divide-ink-700">
        {state.rows.map((row, i) => (
          <li key={row.username} className="flex items-center gap-3 py-2">
            <span className="w-8 text-right font-bold text-marigold-700 dark:text-marigold-300">
              {toDigits(i + 1)}
            </span>
            <span className="flex-1 truncate font-medium">{row.display_name}</span>
            <span className="font-bengaliDisplay font-bold text-sindoor-600">{value(row)}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("heading")} description={t("description")} />
      {!enabled ? (
        <Card>
          <p role="alert">{t("unavailable")}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-t-4 border-t-sindoor-400">
            <h2 className="font-bengaliDisplay mb-2 text-xl font-bold">{t("todayTitle")}</h2>
            {list(daily, (r) => `${toDigits(r.score)}/${toDigits(r.total)}`)}
          </Card>
          <Card className="border-t-4 border-t-marigold-400">
            <h2 className="font-bengaliDisplay mb-2 text-xl font-bold">{t("allTimeTitle")}</h2>
            {list(totals, (r) => t("points", { points: toDigits(r.points) }))}
          </Card>
        </div>
      )}
      <p className="mt-4 text-sm text-ink-500">
        {user ? (
          <>
            {t("publicNote")}{" "}
            <Link href="/account" className="font-semibold text-sindoor-600 underline decoration-dotted">
              {t("accountLink")}
            </Link>
          </>
        ) : (
          <Link href="/login" className="font-semibold text-sindoor-600 underline decoration-dotted">
            {t("signInPrompt")}
          </Link>
        )}
      </p>
    </Container>
  );
}
