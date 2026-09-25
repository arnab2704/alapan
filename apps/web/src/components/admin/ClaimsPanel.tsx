"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getSupabase } from "@/lib/supabase/client";

interface Claim {
  id: string;
  claimant_name: string;
  claimant_email: string;
  content_url: string;
  original_work: string;
  statement: string;
  status: string;
  created_at: string;
}
interface Appeal {
  id: string;
  subject: string;
  reference: string | null;
  message: string;
  status: string;
  created_at: string;
}

const CLAIM_ACTIONS = [
  ["restricted", "Restrict", "সীমিত করুন"],
  ["upheld", "Uphold", "সমর্থন"],
  ["rejected", "Reject", "খারিজ"]
] as const;

/** Copyright claims and appeals for moderators. Every decision is written to the moderation audit log. */
export function ClaimsPanel() {
  const bn = useLocale() === "bn";
  const tr = (b: string, e: string) => (bn ? b : e);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const [c, a] = await Promise.all([
      supabase
        .from("copyright_claims")
        .select("id,claimant_name,claimant_email,content_url,original_work,statement,status,created_at")
        .in("status", ["received", "restricted", "under_review", "counter_notice"])
        .order("created_at")
        .limit(50),
      supabase
        .from("appeals")
        .select("id,subject,reference,message,status,created_at")
        .eq("status", "open")
        .order("created_at")
        .limit(50)
    ]);
    setClaims((c.data as Claim[] | null) ?? []);
    setAppeals((a.data as Appeal[] | null) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function decideClaim(claim: Claim, status: string) {
    const supabase = getSupabase();
    if (!supabase) return;
    const final = status !== "restricted";
    await supabase
      .from("copyright_claims")
      .update({
        status,
        decision_note: note.trim() || null,
        decided_at: final ? new Date().toISOString() : null
      })
      .eq("id", claim.id);
    await supabase.rpc("log_moderation_action", {
      p_action: `copyright_${status}`,
      p_target_type: "copyright",
      p_target_id: claim.id,
      p_detail: { note: note.trim() || null }
    });
    setNote("");
    void load();
  }

  async function decideAppeal(appeal: Appeal, status: "upheld" | "overturned") {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase
      .from("appeals")
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("id", appeal.id);
    await supabase.rpc("log_moderation_action", {
      p_action: `appeal_${status}`,
      p_target_type: "appeal",
      p_target_id: appeal.id,
      p_detail: {}
    });
    void load();
  }

  return (
    <section aria-labelledby="adm-claims" className="mt-10">
      <h2 id="adm-claims" className="eyebrow mb-3">
        {tr("কপিরাইট অভিযোগ ও আপিল", "Copyright claims and appeals")}
      </h2>
      <label className="block text-sm font-medium">
        {tr("সিদ্ধান্তের নোট (ঐচ্ছিক)", "Decision note (optional)")}
        <input
          value={note}
          maxLength={1000}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 py-2 dark:border-ink-600 dark:bg-ink-800"
        />
      </label>

      <h3 className="mt-5 text-sm font-semibold">
        {tr("অভিযোগ", "Claims")} ({claims.length})
      </h3>
      <ul className="mt-2 flex flex-col gap-3">
        {claims.map((claim) => (
          <li key={claim.id} className="card-editorial">
            <p className="font-semibold">
              {claim.claimant_name} · {claim.claimant_email}
            </p>
            <p className="text-sm text-ink-600">{claim.content_url}</p>
            <p className="mt-1 text-sm">{claim.original_work}</p>
            <p className="mt-1 text-sm text-ink-600">{claim.statement}</p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-marigold-50 px-2 py-0.5">{claim.status}</span>
              {CLAIM_ACTIONS.map(([status, en, b]) => (
                <button
                  key={status}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => void decideClaim(claim, status)}
                >
                  {tr(b, en)}
                </button>
              ))}
            </p>
          </li>
        ))}
        {claims.length === 0 ? (
          <li className="text-sm text-ink-500">{tr("কিছু নেই।", "None open.")}</li>
        ) : null}
      </ul>

      <h3 className="mt-6 text-sm font-semibold">
        {tr("আপিল", "Appeals")} ({appeals.length})
      </h3>
      <ul className="mt-2 flex flex-col gap-3">
        {appeals.map((appeal) => (
          <li key={appeal.id} className="card-editorial">
            <p className="font-semibold">{appeal.subject}</p>
            {appeal.reference ? <p className="text-sm text-ink-600">{appeal.reference}</p> : null}
            <p className="mt-1 text-sm">{appeal.message}</p>
            <p className="mt-2 flex gap-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => void decideAppeal(appeal, "overturned")}
              >
                {tr("সিদ্ধান্ত বাতিল", "Overturn")}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => void decideAppeal(appeal, "upheld")}
              >
                {tr("সিদ্ধান্ত বহাল", "Uphold")}
              </button>
            </p>
          </li>
        ))}
        {appeals.length === 0 ? (
          <li className="text-sm text-ink-500">{tr("কিছু নেই।", "None open.")}</li>
        ) : null}
      </ul>
    </section>
  );
}
