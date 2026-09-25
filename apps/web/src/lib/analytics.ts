/**
 * Provider-agnostic product analytics. Components call `track(event, props)`; which service (if
 * any) receives it is decided by the providers registered at startup, so the vendor can change
 * without touching a single component. By default nothing leaves the browser: events go to a
 * no-op provider, and to the console when NEXT_PUBLIC_ANALYTICS_DEBUG=1.
 *
 * Privacy: never put personal data (names, emails, free text) in `props`.
 */
export type AnalyticsEvent =
  | "homepage_view"
  | "today_view"
  | "daily5_started"
  | "daily5_item_completed"
  | "daily5_completed"
  | "game_started"
  | "game_move"
  | "game_completed"
  | "word_dna_opened"
  | "word_saved"
  | "lesson_started"
  | "lesson_completed"
  | "discover_opened"
  | "adda_opened"
  | "share_clicked"
  | "profile_opened"
  | "passport_progress"
  | "signup_started"
  | "signup_completed";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEvent, props: AnalyticsProps): void;
}

const providers: AnalyticsProvider[] = [];

export function registerAnalyticsProvider(provider: AnalyticsProvider): void {
  if (!providers.some((p) => p.name === provider.name)) providers.push(provider);
}

const debugProvider: AnalyticsProvider = {
  name: "debug-console",
  track(event, props) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }
};

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  const targets = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1" ? [debugProvider, ...providers] : providers;
  for (const provider of targets) {
    try {
      provider.track(event, props);
    } catch {
      // An analytics failure must never affect the product.
    }
  }
}

/** Test helper: removes all registered providers. */
export function resetAnalyticsProviders(): void {
  providers.length = 0;
}
