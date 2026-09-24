"use client";

import { Spinner } from "@/components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Container, SectionHeading } from "@alapon/ui";
import { Link } from "@/i18n/navigation";
import {
  fetchOpenReports,
  resolveReport,
  suspendUser,
  type ModerationAction,
  type ReportQueueRow
} from "@/lib/supabase/adda";
import { ghostButton, primaryButton, useAddaError, useFormatDate, useParticipation } from "./addaUi";

export function ModerationQueue() {
  const t = useTranslations("adda");
  const errorText = useAddaError();
  const formatDate = useFormatDate();
  const { ready, userId, isModerator } = useParticipation();
  const [rows, setRows] = useState<ReportQueueRow[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchOpenReports();
    if (error) setMessage(errorText(error));
    else setRows(data);
  }, [errorText]);

  useEffect(() => {
    if (ready && isModerator) void load();
  }, [ready, isModerator, load]);

  async function act(report: ReportQueueRow, action: ModerationAction) {
    if (!userId) return;
    setWorking(report.id);
    const { error } = await resolveReport(userId, report, action);
    if (error) setMessage(errorText(error));
    else await load();
    setWorking(null);
  }

  async function suspend(report: ReportQueueRow) {
    if (!userId || !report.target_author_id) return;
    const { error } = await suspendUser(userId, report.target_author_id, 7);
    if (error) setMessage(errorText(error));
    else {
      setMessage(t("suspended"));
      await act(report, "remove");
    }
  }

  if (!ready) return <Container className="py-10">{null}</Container>;
  if (!isModerator) {
    return (
      <Container className="py-10">
        <p role="alert">{t("moderatorsOnly")}</p>
        <Link href="/theke-adda" className="mt-3 inline-block font-semibold text-sindoor-600 underline">
          {t("backToAdda")}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading title={t("queueTitle")} description={t("queueDescription")} />
      {message ? (
        <p role="status" className="mb-3 text-sm text-ink-600">
          {message}
        </p>
      ) : null}
      {rows === null ? (
        <p className="text-ink-500">{t("loading")}</p>
      ) : rows.length === 0 ? (
        <p className="text-ink-500">{t("queueEmpty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Card className={r.priority === "high" ? "border-l-4 border-l-sindoor-500" : ""}>
                <p className="text-xs font-semibold text-sindoor-600">
                  {t(`reasons.${r.reason}`)} · {r.target_type} · {formatDate(r.created_at)}
                  {r.priority === "high" ? ` · ${t("highPriority")}` : ""}
                </p>
                {r.description ? <p className="mt-1 text-sm italic text-ink-600">{r.description}</p> : null}
                <p className="mt-2 whitespace-pre-wrap rounded bg-cream-200 p-2 text-sm dark:bg-ink-700">
                  {r.target_text ?? t("contentGone")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={working !== null}
                    aria-busy={working === r.id}
                    onClick={() => act(r, "remove")}
                    className={`${primaryButton} gap-2`}
                  >
                    {working === r.id ? <Spinner /> : null}
                    {t("removeContent")}
                  </button>
                  <button
                    type="button"
                    disabled={working !== null}
                    onClick={() => act(r, "dismiss")}
                    className={ghostButton}
                  >
                    {t("dismiss")}
                  </button>
                  {r.target_author_id ? (
                    <button type="button" onClick={() => suspend(r)} className={ghostButton}>
                      {t("suspendAuthor")}
                    </button>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
