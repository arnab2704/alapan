"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "@/i18n/navigation";
import { getSupabase } from "@/lib/supabase/client";

const field =
  "mt-1 w-full rounded-lg border border-ink-200 bg-cream-100 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:border-ink-600 dark:bg-ink-800";

/** Public copyright claim form: claim -> record -> moderator review (see docs/compliance). */
export function CopyrightReportForm() {
  const bn = useLocale() === "bn";
  const tr = (b: string, e: string) => (bn ? b : e);
  const { user } = useAuth();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [values, setValues] = useState({
    name: "",
    email: "",
    url: "",
    work: "",
    statement: "",
    goodFaith: false
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return setState("error");
    setState("busy");
    const { error } = await supabase.from("copyright_claims").insert({
      claimant_name: values.name.trim(),
      claimant_email: values.email.trim(),
      content_url: values.url.trim(),
      original_work: values.work.trim(),
      statement: values.statement.trim(),
      good_faith: values.goodFaith,
      reporter_id: user?.id ?? null
    });
    setState(error ? "error" : "done");
  }

  const set =
    (key: "name" | "email" | "url" | "work" | "statement") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues({ ...values, [key]: e.target.value });

  return (
    <Container className="max-w-xl py-10 sm:py-14">
      <SectionHeading
        title={tr("কপিরাইট অভিযোগ", "Report copyright")}
        description={tr(
          "আলাপনের কোনো বিষয় আপনার কাজ অনুমতি ছাড়া ব্যবহার করলে এখানে জানান।",
          "Tell us if something on Alapon uses your work without permission."
        )}
      />
      {state === "done" ? (
        <Card>
          <p role="status" className="font-semibold text-shapla-700 dark:text-shapla-300">
            {tr(
              "অভিযোগ পেয়েছি। আমরা পর্যালোচনা করে ইমেইলে জানাব।",
              "We received your claim. We will review it and reply by email."
            )}
          </p>
        </Card>
      ) : (
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="text-sm font-medium">
              {tr("আপনার নাম", "Your name")}
              <input
                required
                minLength={2}
                maxLength={200}
                value={values.name}
                onChange={set("name")}
                className={field}
              />
            </label>
            <label className="text-sm font-medium">
              {tr("ইমেইল", "Email")}
              <input
                required
                type="email"
                maxLength={200}
                value={values.email}
                onChange={set("email")}
                className={field}
              />
            </label>
            <label className="text-sm font-medium">
              {tr("আলাপনে বিষয়টির ঠিকানা (URL)", "Address (URL) of the content on Alapon")}
              <input
                required
                minLength={5}
                maxLength={500}
                value={values.url}
                onChange={set("url")}
                className={field}
              />
            </label>
            <label className="text-sm font-medium">
              {tr("আপনার মূল কাজ কোনটি", "Your original work")}
              <textarea
                required
                minLength={5}
                maxLength={1000}
                rows={3}
                value={values.work}
                onChange={set("work")}
                className={field}
              />
            </label>
            <label className="text-sm font-medium">
              {tr("কেন এটি লঙ্ঘন", "Why this infringes")}
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                value={values.statement}
                onChange={set("statement")}
                className={field}
              />
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                required
                checked={values.goodFaith}
                onChange={(e) => setValues({ ...values, goodFaith: e.target.checked })}
                className="mt-1 h-5 w-5"
              />
              <span>
                {tr(
                  "আমি সরল বিশ্বাসে বলছি যে ব্যবহারটি কপিরাইট মালিকের অনুমতি ছাড়া এবং আমার দেওয়া তথ্য সঠিক।",
                  "I state in good faith that this use is not authorised by the copyright owner and the information I give is accurate."
                )}
              </span>
            </label>
            {state === "error" ? (
              <p role="alert" className="text-sm font-medium text-sindoor-700 dark:text-sindoor-300">
                {tr(
                  "এখন পাঠানো যায়নি। একটু পরে আবার চেষ্টা করুন।",
                  "Could not send right now. Please try again shortly."
                )}
              </p>
            ) : null}
            <button type="submit" disabled={state === "busy"} className="btn btn-primary">
              {tr("অভিযোগ পাঠান", "Submit claim")}
            </button>
            <p className="text-xs text-ink-500">
              <Link href="/copyright-policy" className="underline">
                {tr("কপিরাইট নীতি", "Copyright policy")}
              </Link>
            </p>
          </form>
        </Card>
      )}
    </Container>
  );
}
