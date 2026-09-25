"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  getAllAddaPromptsCount,
  getAllDailyWords,
  getAllDiscoveries,
  getAllFestivals,
  getAllWordEntries
} from "@alapon/bengali";
import { getDailyChallengeSpec, resolveDailyChallenge, TOTAL_WORDJAAL_LEVELS } from "@alapon/game-engine";
import type { DailyDifficulty, DailyRoundSpec } from "@alapon/game-engine";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { ClaimsPanel } from "./ClaimsPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "@/i18n/navigation";
import { toLocalIsoDate } from "@/lib/formatDate";
import { getSupabase } from "@/lib/supabase/client";

const field =
  "mt-1 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800";

interface Row {
  day: string;
  status: "draft" | "published";
  difficulty: string | null;
  rounds: DailyRoundSpec[];
}

/** Staff-only console. Daily Challenge scheduling writes to Supabase (RLS: admins only); the rest is a read-only content overview. */
export function AdminPage() {
  const bn = useLocale() === "bn";
  const tr = (b: string, e: string) => (bn ? b : e);
  const { ready, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [day, setDay] = useState(() => toLocalIsoDate(new Date(Date.now() + 86_400_000)));
  const [difficulty, setDifficulty] = useState<DailyDifficulty | "">("");
  const [rounds, setRounds] = useState<DailyRoundSpec[]>([
    { level: 1, index: 0 },
    { level: 2, index: 0 },
    { level: 3, index: 0 }
  ]);
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase
      .from("daily_challenges")
      .select("day,status,difficulty,rounds")
      .order("day", { ascending: false })
      .limit(30);
    setRows((data as Row[] | null) ?? []);
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const preview = useMemo(() => {
    try {
      const override = { rounds, difficulty: difficulty || undefined };
      return {
        ok: true as const,
        content: resolveDailyChallenge(day, override),
        spec: getDailyChallengeSpec(day, override)
      };
    } catch {
      return { ok: false as const };
    }
  }, [day, rounds, difficulty]);

  async function save(status: "draft" | "published") {
    const supabase = getSupabase();
    if (!supabase || !preview.ok || preview.spec.source !== "scheduled") {
      setMessage(
        tr("রাউন্ডগুলো ঠিক নেই - লেভেল ও সংখ্যা যাচাই করুন।", "Rounds are not valid - check level and index.")
      );
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("daily_challenges")
      .upsert({ day, rounds, difficulty: difficulty || null, status });
    setBusy(false);
    setMessage(
      error
        ? tr(
            "সংরক্ষণ হয়নি (0005 মাইগ্রেশন চালানো হয়েছে?)",
            "Save failed (has migration 0005 been applied?)"
          )
        : status === "published"
          ? tr("প্রকাশিত হয়েছে।", "Published.")
          : tr("খসড়া সংরক্ষিত।", "Draft saved.")
    );
    void load();
  }

  if (!ready) return null;
  if (!isAdmin) {
    return (
      <Container className="max-w-2xl py-14">
        <SectionHeading
          title={tr("অ্যাডমিন", "Admin")}
          description={tr("এই পাতা শুধু অ্যাডমিনদের জন্য।", "This page is for admins only.")}
        />
      </Container>
    );
  }

  const counts: Array<[string, number]> = [
    [tr("শব্দ (Word DNA)", "Words (Word DNA)"), getAllWordEntries().length],
    [tr("আজকের শব্দ", "Daily words"), getAllDailyWords().length],
    [tr("আবিষ্কার", "Discoveries"), getAllDiscoveries().length],
    [tr("উৎসব", "Festivals"), getAllFestivals().length],
    [tr("আড্ডার প্রশ্ন", "Adda prompts"), getAllAddaPromptsCount()],
    [tr("শব্দজাল লেভেল", "ShobdoShakti levels"), TOTAL_WORDJAAL_LEVELS]
  ];

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        title={tr("অ্যাডমিন", "Admin")}
        description={tr(
          "আজকের চ্যালেঞ্জ সাজান, কনটেন্ট দেখুন।",
          "Schedule the Daily Challenge and review content."
        )}
      />

      <section aria-labelledby="adm-content" className="mb-10">
        <h2 id="adm-content" className="eyebrow mb-3">
          {tr("কনটেন্ট", "Content")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {counts.map(([label, n]) => (
            <li key={label} className="card-editorial">
              <p className="text-sm text-ink-600">{label}</p>
              <p className="display text-3xl">{n}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/moderation" className="btn btn-secondary btn-sm">
            {tr("মডারেশন", "Moderation")}
          </Link>
          <Link href="/discover" className="btn btn-secondary btn-sm">
            {tr("আবিষ্কার দেখুন", "View Discover")}
          </Link>
        </p>
      </section>

      <section aria-labelledby="adm-daily">
        <h2 id="adm-daily" className="eyebrow mb-3">
          {tr("ডেইলি চ্যালেঞ্জ", "Daily Challenge")}
        </h2>
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              {tr("তারিখ", "Date")}
              <input type="date" value={day} onChange={(e) => setDay(e.target.value)} className={field} />
            </label>
            <label className="text-sm font-medium">
              {tr("কঠিনতা", "Difficulty")}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DailyDifficulty | "")}
                className={field}
              >
                <option value="">{tr("স্বয়ংক্রিয়", "Auto")}</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </label>
          </div>
          {rounds.map((r, i) => (
            <fieldset key={i} className="mt-4 grid gap-4 sm:grid-cols-2">
              <legend className="text-sm font-semibold">
                {tr("রাউন্ড", "Round")} {i + 1}
              </legend>
              <label className="text-sm font-medium">
                {tr("লেভেল (১–", "Level (1–")}
                {TOTAL_WORDJAAL_LEVELS})
                <input
                  type="number"
                  min={1}
                  max={TOTAL_WORDJAAL_LEVELS}
                  value={r.level}
                  onChange={(e) =>
                    setRounds(rounds.map((x, j) => (j === i ? { ...x, level: Number(e.target.value) } : x)))
                  }
                  className={field}
                />
              </label>
              <label className="text-sm font-medium">
                {tr("সংখ্যা (০ থেকে)", "Index (from 0)")}
                <input
                  type="number"
                  min={0}
                  value={r.index}
                  onChange={(e) =>
                    setRounds(rounds.map((x, j) => (j === i ? { ...x, index: Number(e.target.value) } : x)))
                  }
                  className={field}
                />
              </label>
            </fieldset>
          ))}

          <div className="mt-5" aria-live="polite">
            <p className="eyebrow">{tr("প্রিভিউ", "Preview")}</p>
            {preview.ok && preview.spec.source === "scheduled" ? (
              <ol className="mt-2 flex flex-col gap-2">
                {preview.content.rounds.map((r, i) => (
                  <li key={i} className="rounded-lg bg-cream-200 p-3 dark:bg-ink-800">
                    <span lang="bn" className="font-bengaliDisplay text-xl font-bold">
                      {r.letters.join(" ")}
                    </span>
                    <span className="ml-3 text-sm text-ink-600">
                      {r.canForm.length} {tr("টি শব্দ সম্ভব", "words possible")}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm text-sindoor-700">
                {tr("এই রাউন্ডগুলো বৈধ নয়।", "These rounds are not valid.")}
              </p>
            )}
          </div>

          <p className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={busy}
              onClick={() => void save("draft")}
            >
              {tr("খসড়া সংরক্ষণ", "Save draft")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => void save("published")}
            >
              {tr("প্রকাশ করুন", "Publish")}
            </button>
          </p>
          {message ? (
            <p role="status" className="mt-3 text-sm">
              {message}
            </p>
          ) : null}
        </Card>

        {rows.length > 0 ? (
          <ul
            className="mt-6 divide-y divide-ink-100 dark:divide-ink-700"
            aria-label={tr("নির্ধারিত দিন", "Scheduled days")}
          >
            {rows.map((r) => (
              <li key={r.day} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-semibold">{r.day}</span>
                <span>{r.status}</span>
                <span className="text-ink-600">
                  {r.rounds.map((x) => `L${x.level}#${x.index}`).join(", ")}
                </span>
                <button
                  type="button"
                  className="btn btn-text btn-sm"
                  onClick={() => {
                    setDay(r.day);
                    setRounds(r.rounds);
                    setDifficulty((r.difficulty as DailyDifficulty | null) ?? "");
                  }}
                >
                  {tr("সম্পাদনা", "Edit")}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
      <ClaimsPanel />
    </Container>
  );
}
