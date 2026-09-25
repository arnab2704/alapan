# Analytics

`apps/web/src/lib/analytics.ts`: `track(event, props)` -> registered providers. Default is a no-op (nothing leaves the browser); `NEXT_PUBLIC_ANALYTICS_DEBUG=1` logs to console. No personal data or free text in props. Swap vendor via `registerAnalyticsProvider`.

Events wired: `homepage_view`, `today_view`, `daily5_started`, `daily5_item_completed`, `daily5_completed`, `game_started`, `game_move`, `game_completed`, `word_dna_opened`, `word_saved`, `lesson_completed`, `discover_opened`, `adda_opened`, `share_clicked`, `profile_opened`, `passport_progress`.
Declared but not yet fired: `lesson_started`, `signup_started`, `signup_completed`.
