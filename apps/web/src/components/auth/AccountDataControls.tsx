"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Card } from "@alapon/ui";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

const field =
  "mt-1 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800";

const APPEAL_SUBJECTS = ["post_removed", "comment_removed", "suspension", "copyright"] as const;

/** Privacy controls: download my data, request deletion, and appeal a moderation decision. */
export function AccountDataControls() {
  const bn = useLocale() === "bn";
  const tr = (b: string, e: string) => (bn ? b : e);
  const { user } = useAuth();
  const [pendingDeletion, setPendingDeletion] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [appeal, setAppeal] = useState({ subject: "post_removed", reference: "", message: "" });

  const loadDeletion = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    const { data } = await supabase
      .from("deletion_requests")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    setPendingDeletion(data?.status === "pending");
  }, [user]);

  useEffect(() => {
    void loadDeletion();
  }, [loadDeletion]);

  if (!user) return null;

  async function download() {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    const [profile, quiz, posts, comments] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("quiz_results").select("*").eq("user_id", user.id),
      supabase.from("posts").select("*").eq("author_id", user.id),
      supabase.from("comments").select("*").eq("author_id", user.id)
    ]);
    const local: Record<string, string | null> = {};
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key?.startsWith("alapon.")) local[key] = localStorage.getItem(key);
      }
    } catch {
      // Storage may be unavailable; the account data is still exported.
    }
    const payload = {
      exportedAt: new Date().toISOString(),
      email: user.email,
      profile: profile.data,
      quizResults: quiz.data ?? [],
      posts: posts.data ?? [],
      comments: comments.data ?? [],
      thisDevice: local
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "alapon-my-data.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice(tr("তথ্য ডাউনলোড হয়েছে।", "Your data was downloaded."));
  }

  async function requestDeletion() {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("deletion_requests")
      .upsert({ user_id: user.id, status: "pending", requested_at: new Date().toISOString() });
    setConfirming(false);
    if (error) return setNotice(tr("অনুরোধ পাঠানো যায়নি।", "Could not send the request."));
    setPendingDeletion(true);
    setNotice(
      tr(
        "মুছে ফেলার অনুরোধ নেওয়া হয়েছে; ৩০ দিনের মধ্যে সম্পন্ন হবে।",
        "Deletion requested; it will be completed within 30 days."
      )
    );
  }

  async function cancelDeletion() {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    await supabase.from("deletion_requests").update({ status: "cancelled" }).eq("user_id", user.id);
    setPendingDeletion(false);
    setNotice(tr("অনুরোধ বাতিল হয়েছে।", "Request cancelled."));
  }

  async function sendAppeal(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !user) return;
    const { error } = await supabase.from("appeals").insert({
      user_id: user.id,
      subject: appeal.subject,
      reference: appeal.reference.trim() || null,
      message: appeal.message.trim()
    });
    if (error) return setNotice(tr("আপিল পাঠানো যায়নি।", "Could not send the appeal."));
    setAppeal({ subject: "post_removed", reference: "", message: "" });
    setNotice(tr("আপিল পাঠানো হয়েছে; একজন মডারেটর দেখবেন।", "Appeal sent; a moderator will review it."));
  }

  const subjectLabel: Record<(typeof APPEAL_SUBJECTS)[number], string> = {
    post_removed: tr("আমার লেখা সরানো হয়েছে", "My post was removed"),
    comment_removed: tr("আমার মন্তব্য সরানো হয়েছে", "My comment was removed"),
    suspension: tr("আমার অ্যাকাউন্ট স্থগিত", "My account was suspended"),
    copyright: tr("কপিরাইট সিদ্ধান্ত", "Copyright decision")
  };

  return (
    <Card className="mt-6">
      <h2 className="display text-2xl">{tr("গোপনীয়তা ও তথ্য", "Privacy and data")}</h2>
      <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">
        {tr(
          "নিজের তথ্য ডাউনলোড করুন বা অ্যাকাউন্ট মুছে ফেলার অনুরোধ করুন।",
          "Download your data or ask us to delete your account."
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn btn-secondary" onClick={() => void download()}>
          {tr("আমার তথ্য ডাউনলোড", "Download my data")}
        </button>
        {pendingDeletion ? (
          <button type="button" className="btn btn-ghost" onClick={() => void cancelDeletion()}>
            {tr("মুছে ফেলার অনুরোধ বাতিল", "Cancel deletion request")}
          </button>
        ) : confirming ? (
          <>
            <button type="button" className="btn btn-primary" onClick={() => void requestDeletion()}>
              {tr("হ্যাঁ, মুছে ফেলুন", "Yes, delete my account")}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
              {tr("না", "No")}
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => setConfirming(true)}>
            {tr("অ্যাকাউন্ট মুছে ফেলুন", "Delete my account")}
          </button>
        )}
      </div>
      {pendingDeletion ? (
        <p className="mt-2 text-sm text-sindoor-700 dark:text-sindoor-300">
          {tr("মুছে ফেলার অনুরোধ অপেক্ষমাণ।", "A deletion request is pending.")}
        </p>
      ) : null}

      <form
        onSubmit={sendAppeal}
        className="mt-8 flex flex-col gap-3 border-t border-ink-100 pt-6 dark:border-ink-700"
      >
        <h3 className="display text-xl">{tr("মডারেশন সিদ্ধান্তের আপিল", "Appeal a moderation decision")}</h3>
        <label className="text-sm font-medium">
          {tr("বিষয়", "About")}
          <select
            value={appeal.subject}
            onChange={(e) => setAppeal({ ...appeal, subject: e.target.value })}
            className={field}
          >
            {APPEAL_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {subjectLabel[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          {tr("লেখার শিরোনাম বা ঠিকানা (ঐচ্ছিক)", "Post title or address (optional)")}
          <input
            maxLength={200}
            value={appeal.reference}
            onChange={(e) => setAppeal({ ...appeal, reference: e.target.value })}
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          {tr("আপনার বক্তব্য", "Your message")}
          <textarea
            required
            minLength={10}
            maxLength={1500}
            rows={4}
            value={appeal.message}
            onChange={(e) => setAppeal({ ...appeal, message: e.target.value })}
            className={field}
          />
        </label>
        <button type="submit" className="btn btn-secondary self-start">
          {tr("আপিল পাঠান", "Send appeal")}
        </button>
      </form>
      {notice ? (
        <p role="status" className="mt-4 text-sm font-medium text-shapla-700 dark:text-shapla-300">
          {notice}
        </p>
      ) : null}
    </Card>
  );
}
