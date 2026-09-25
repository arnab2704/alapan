"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@alapon/ui";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link } from "@/i18n/navigation";

/** Language and data controls. Everything here acts on this device only. */
export function SettingsPage() {
  const t = useTranslations("settings");
  const { user } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  function clearLocalData() {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("alapon."))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // storage unavailable: nothing to clear
    }
    setConfirming(false);
    setCleared(true);
  }

  return (
    <Container className="max-w-2xl py-8 sm:py-12">
      <h1 className="display text-4xl">{t("heading")}</h1>

      <section aria-labelledby="settings-language" className="mt-8">
        <h2 id="settings-language" className="display text-2xl">
          {t("language")}
        </h2>
        <p className="mt-1 text-ink-600 dark:text-ink-200">{t("languageHint")}</p>
        <div className="mt-3">
          <LocaleSwitcher />
        </div>
      </section>

      <section
        aria-labelledby="settings-motion"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="settings-motion" className="display text-2xl">
          {t("motion")}
        </h2>
        <p className="reading mt-1 text-ink-600 dark:text-ink-200">{t("motionHint")}</p>
      </section>

      <section
        aria-labelledby="settings-data"
        className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700"
      >
        <h2 id="settings-data" className="display text-2xl">
          {t("data")}
        </h2>
        <p className="reading mt-1 text-ink-600 dark:text-ink-200">{t("dataHint")}</p>
        {cleared ? (
          <p role="status" className="mt-3 font-semibold text-shapla-700 dark:text-shapla-300">
            {t("cleared")}
          </p>
        ) : confirming ? (
          <div role="alertdialog" aria-label={t("confirmTitle")} className="card-result mt-3 text-left">
            <p className="font-semibold">{t("confirmTitle")}</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{t("confirmBody")}</p>
            <p className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={clearLocalData} className="btn btn-primary">
                {t("confirmYes")}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="btn btn-secondary">
                {t("confirmNo")}
              </button>
            </p>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="btn btn-secondary mt-3">
            {t("clear")}
          </button>
        )}
      </section>

      <p className="mt-10">
        {user ? (
          <Link href="/account" className="btn btn-text">
            {t("account")}
          </Link>
        ) : (
          <Link href="/login" className="btn btn-text">
            {t("signIn")}
          </Link>
        )}
      </p>
    </Container>
  );
}
