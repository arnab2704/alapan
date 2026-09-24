"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  privacy_level: "private" | "public";
  is_adult: boolean;
  role: "user" | "moderator" | "admin";
}

interface AuthState {
  /** False until the first session check finishes. */
  ready: boolean;
  /** False when Supabase env vars are absent. */
  enabled: boolean;
  user: User | null;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  ready: false,
  enabled: false,
  user: null,
  profile: null,
  refreshProfile: async () => {},
  signOut: async () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabase();
  const [ready, setReady] = useState(!supabase);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(
    async (u: User | null) => {
      if (!supabase || !u) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, privacy_level, is_adult, role")
        .eq("id", u.id)
        .maybeSingle();
      setProfile((data as Profile | null) ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      loadProfile(data.session?.user ?? null).finally(() => active && setReady(true));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Defer to avoid calling Supabase inside the auth callback.
      setTimeout(() => loadProfile(session?.user ?? null), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      enabled: Boolean(supabase),
      user,
      profile,
      refreshProfile: () => loadProfile(user),
      signOut: async () => {
        await supabase?.auth.signOut();
      }
    }),
    [ready, supabase, user, profile, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
