"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "./AuthProvider";

const pillClass =
  "flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium text-ink-800 hover:bg-sindoor-50 hover:text-sindoor-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:text-ink-100 dark:hover:bg-ink-800";
const itemClass =
  "flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-ink-800 hover:bg-sindoor-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sindoor-500 dark:text-ink-100 dark:hover:bg-ink-700";

function Avatar({ name }: { name: string }) {
  const initial = Array.from(name)[0] ?? "?";
  return (
    <span
      aria-hidden="true"
      className="font-bengaliDisplay flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sindoor-500 text-sm font-bold text-white"
    >
      {initial.toUpperCase()}
    </span>
  );
}

/**
 * Account entry for the header: a "Sign in" link for visitors, and for signed-in
 * people their name with a dropdown (welcome line, account, sign out). The
 * "list" variant renders the same actions inline for the mobile menu.
 */
export function UserMenu({ variant }: { variant: "dropdown" | "list" }) {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const { enabled, user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (!enabled) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className={`${pillClass} ${variant === "dropdown" ? "border border-ink-200 dark:border-ink-600" : ""}`}
      >
        {t("signIn")}
      </Link>
    );
  }

  const name = profile?.display_name ?? user.email?.split("@")[0] ?? t("account");
  const isModerator = profile?.role === "moderator" || profile?.role === "admin";

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.replace("/");
  }

  const actions = (
    <>
      <Link href="/account" onClick={() => setOpen(false)} className={itemClass}>
        {t("myAccount")}
      </Link>
      {isModerator ? (
        <Link href="/moderation" onClick={() => setOpen(false)} className={itemClass}>
          {tAuth("moderationLink")}
        </Link>
      ) : null}
      <button type="button" onClick={handleSignOut} className={itemClass}>
        {t("signOut")}
      </button>
    </>
  );

  if (variant === "list") {
    return (
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-2 px-3 text-sm font-semibold text-ink-900 dark:text-ink-50">
          <Avatar name={name} />
          <span className="truncate">{t("welcomeUser", { name })}</span>
        </p>
        {actions}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${pillClass} border border-ink-200 dark:border-ink-600`}
      >
        <Avatar name={name} />
        <span className="max-w-[8rem] truncate">{name}</span>
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-alpona border border-ink-100 bg-cream-50 p-2 shadow-lg shadow-ink-900/10 dark:border-ink-700 dark:bg-ink-900"
        >
          <p className="font-bengaliDisplay truncate px-3 py-2 text-sm font-bold text-sindoor-700 dark:text-sindoor-300">
            {t("welcomeUser", { name })}
          </p>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
