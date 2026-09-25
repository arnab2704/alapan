# Alapon V1.5 - progress and resume guide

This file is the source of truth for the V1.5 "daily Bengali home" build. **If a session is interrupted, read this file first, then continue with the first unchecked step.** Keep the app runnable after every step (`npm run typecheck -w apps/web && npm run lint -w apps/web && npm test`, then the relevant Playwright specs).

## Ground rules (from the brief)

- Do not rebuild. Reuse existing components and the "Modern Bengal" look (warm ivory, Bengal red, muted gold, Bengali-first type).
- No aggressive gamification copy. Warm language: "আজকের আলাপন সম্পূর্ণ।", "কাল আবার দেখা হবে।"
- Do not build: AI chatbot, real-time multiplayer, payments, ads, native apps, complex social graph.
- Do not run `next build` in `apps/web/.next` while a dev server is running; use `NEXT_DIST_DIR=.next-verify npm run build -w apps/web` then delete the folder.
- Do not commit or push unless the owner asks. Never commit `.env.local`.
- Windows/Git-Bash gotchas: write files with the Write tool (heredocs with apostrophes break); run python with `PYTHONIOENCODING=utf-8`.

## Decisions

- Routes: keep the existing next-intl routing (`/[locale]/...`). Keep `/theke-adda` as the Adda route (an `/adda` alias is documented, not built). Add: `/play/shobdoshakti/{daily,free,levels,result/[id]}`, `/word/[slug]`, `/discover/[slug]`, `/festival/[slug]`, `/passport`, `/profile`, `/settings`, `/admin`, `/search`.
- Daily ShobdoShakti = a deterministic "puzzle of the day" built from the existing শব্দজাল combinations (letters + words that can be formed). Same for everyone on a date. An admin can override a date via the `daily_challenges` table (migration 0005); otherwise a seeded fallback picks the puzzle (difficulty follows the weekday).
- Word DNA works for any word: curated words in the word bank get the full page; other words get a "basic DNA" (structure, letters, difficulty) with `noindex`.
- Bengal Passport is local-first (localStorage) with categories: words, places, people, festivals, stories, games, lessons. Server sync is a later step.
- Analytics: provider-agnostic `track(event, props)` in `apps/web/src/lib/analytics.ts` (no-op + dev console by default).
- Design tokens: CSS variables in `globals.css` mapped to the existing Tailwind palette (no palette change).

## Steps

- [x] 1 Audit -> `docs/ALAPON_CURRENT_STATE.md`
- [x] 2 Design system cleanup (tokens, buttons, card variants) -> `docs/ALAPON_DESIGN_SYSTEM.md`
- [x] 3 Global navigation (5 items, search, profile, mobile bottom nav)
- [x] 4 Homepage redesign
- [x] 5 Today page
- [x] 6 Daily 5
- [x] 7 ShobdoShakti UX + Daily Challenge + mode routes -> `docs/ALAPON_GAME_ENGINE.md`
- [x] 8 Game result screen
- [x] 9 Word DNA + word bank + save word
- [x] 10 Profile / Bengal Passport
- [x] 11 Learn integration (learn-through-play)
- [x] 12 Discover integration (content model, detail pages)
- [x] 13 Adda refinement (today's prompt)
- [x] 14 Festival passport (`/festival/[slug]`)
- [x] 15 Share cards (Daily 5, ShobdoShakti)
- [x] 16 Mobile optimisation pass
- [x] 17 Accessibility pass
- [x] 18 SEO (metadata, structured data, sitemap)
- [x] 19 Analytics events -> `docs/ALAPON_ANALYTICS.md`
- [x] 20 Admin (daily challenge scheduling, content lists) + migration 0005 -> `docs/ALAPON_CONTENT_MODEL.md`
- [x] 21 Performance pass
- [x] 22 Final docs (`ALAPON_V1_5_ARCHITECTURE.md`, `ALAPON_ROADMAP.md`) + final summary

## Log

(append one line per finished step: what changed, which tests were run)

- Step 1 done (25 Sep 2026): audit written, no code changed.
- Step 2 done: tokens + `.btn*`/`.card-*` classes in globals.css, `buttonClasses()` + `Card variant` in @alapon/ui, 19 files migrated off copy-pasted button strings, docs/ALAPON_DESIGN_SYSTEM.md. Tests: typecheck, lint, e2e homepage/quiz/learn/welcome (25 pass).
- Step 3 done: `components/nav/*` (SiteHeader 5 direct links + search + profile, BottomNav with immersive-screen hiding, CompactLocaleToggle), MegaMenu removed, footer sitemap, `/search` (Bengali-aware index in `lib/searchIndex.ts`), temporary `/profile` `/passport` placeholders (real ones in step 10). e2e 101/103 pass in full run; the 2 failures pass in isolation (dev-compile load flakes).
- Steps 4-6 done: homepage (hero promise -> Today strip -> Daily 5 -> Continue -> Word + Discover -> Editorial -> Play -> Learn -> Adda), Today page (editorial rhythm, five interactive sections), Daily 5 (`lib/daily5.ts`, `useDaily5`, tracker + gentle completion + share), `lib/analytics.ts`, engine `getDailyLearnMoment` + `participationStreak` + Adda prompts (tests: bengali 62, game-engine 128). HomeCalendarWidget/HomeDailyQuiz removed. **Pending inside these steps:** the game item is marked by the Daily Challenge (step 7); links to `/play/shobdoshakti/daily|levels` exist only after step 7.
- Steps 7-8 done: engine `dailyChallenge.ts` (3 rounds by weekday difficulty, editor override, `summarizeDailyResult`; 137 engine tests), API `/api/shobdoshakti/daily`, `lib/supabase/scheduledChallenge.ts` (override lookup; table comes in step 20), routes `/play/shobdoshakti` (hub) `/daily` `/free` `/levels` `/result/[id]`, `useDailyChallenge`, `DailyChallengeGame`, `GameResult` (count-up score, best word, words list linking to `/word/[slug]`, Daily 5 link, share), `ModeNav` replaced the tab toggle, game tests updated (levels default path), e2e `shobdoshakti-daily.spec.ts`. **Pending:** `/word/[slug]` (step 9), ranking (step 20).
- Step 9 done: word bank (`packages/bengali/src/data/word-bank.ts`, 90+ curated words, 25+ with cultural notes, plus the 28 daily words) + `words.ts` (`getWordDNA`, `getWordEntry`, `estimateDifficulty`; 209 unit tests incl. coverage of game words), `/word/[slug]` (any Bengali word; curated ones indexable + JSON-LD, others noindex), `WordDna` (tile reveal, meaning, sound, stars, related, story, why-this-word, practice, save, share), `WordPractice`, `lib/savedWords.ts`, `lib/passport.ts`, branded `[locale]/not-found.tsx`, search now links words to DNA. Removed `[locale]/loading.tsx` (it turned invalid addresses into soft 404s). New e2e `word-dna.spec.ts` and `console-clean.spec.ts` (caught a hydration bug in WordPractice, fixed).
- Step 10 done: `lib/passport.ts` (7 categories, milestones 1/10/25/50/100, `recordDiscovery` hooked into Word DNA, Today discovery, daily game finish, lesson finish, Puja hub, editorial reading), `/passport` (passport cover + progress-ring stamps), `/profile` ("আমার আলাপন": passport summary, today, saved words, games, learning, history), `/settings` (language, motion note, clear device data with confirmation). e2e `passport-profile.spec.ts` (first runs after a route compiles can exceed the default timeout under load; they pass on rerun).
- Step 11 done: Learn home has 6 category cards, lesson complete screen links lesson words to Word DNA and to the game; lessons recorded in passport.
- Step 12 done: `/discover` hub (today, kind filter, search) and `/discover/[slug]` (words, related, play-with-words, passport, share, Article JSON-LD), search + sitemap indexed. Tests: discover.spec (5) + homepage.spec pass.
- Step 13 done: Adda page shows Today's prompt card; `?prompt=today` and the answer button prefill the composer (category aajker-adda).
- Step 14 done: `/festival/[slug]` for every festival (dates, days, lunisolar note, Puja passport link, passport stamp, Event JSON-LD, share), search + sitemap point to it. e2e in discover.spec.
- Steps 15-21 done: share = text share via Web Share/clipboard (Daily 5, ShobdoShakti result, discovery, festival, word) - no image card because Satori cannot shape Bengali; `lib/pageMetadata.ts` gives titles/descriptions to today/play/learn/calendar/puja/leaderboard/adda/shobdoshakti pages; `lesson_completed` + `adda_opened` events; migration `database/migrations/0005_daily_challenges.sql` (daily_challenges, game_results, daily_rank) + `/admin` (admin-only: content counts, Daily Challenge schedule/preview/publish). Ranking UI not built (table+function ready).
- Step 22 done: docs ARCHITECTURE/GAME_ENGINE/CONTENT_MODEL/ANALYTICS/ROADMAP written. Final verification: prettier clean, typecheck+lint clean, vitest 215 pass, isolated production build OK, Playwright 135 tests (130 pass first run; the 5 dev-compile-timeout failures pass on rerun). V1.5 COMPLETE.
- Production-readiness pass: legal pages (/terms /privacy /copyright-policy /safety), /report-copyright + migration 0006 (copyright_claims, content_sources, media_assets, appeals, deletion_requests), account export/deletion/appeal, mute, admin claims panel, PWA (manifest + sw.js), security headers, error boundaries, optional PostHog provider, 12 new Discover entries in 6 new categories, docs/compliance + docs/DEPLOYMENT.md, e2e production.spec. Verified: typecheck, lint, 215 unit tests, isolated build, next start (headers, sw, manifest, 404), Playwright 142 tests (parallel dev-compile flakes pass serially).
