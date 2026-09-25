# Alapon - current state (audit before V1.5)

Audit date: 25 September 2026. Nothing was changed during the audit.

## 1. Architecture

- **Monorepo (npm workspaces):** `apps/web` (Next.js 14 App Router, TypeScript, Tailwind, next-intl, framer-motion), `packages/bengali` (Unicode/grapheme/tokenizer, Bengali calendar, festivals, daily culture data), `packages/game-engine` (ShobdoShakti board engine, শব্দজাল engine, quizzes, learn course, share/challenge helpers), `packages/ui` (small primitives), `packages/config` (Tailwind tokens), `packages/types`.
- **Rendering:** mostly statically generated pages with client components that compute "today" after mount (so no build-time date freezing). Dynamic: `/theke-adda/[id]`, `/quiz/challenge`, `/api/og` (edge).
- **State:** local component state + `localStorage` (quiz progress, learn progress, শব্দজাল progress, Puja Passport). No global store.
- **Backend:** Supabase (Postgres + Auth + RLS) accessed from the browser with the publishable key. Migrations `database/migrations/0001-0004`, seeds in `database/seeds`. Auth via `AuthProvider` (password / email link). Roles: user, moderator, admin.
- **i18n:** `bn` (default) and `en`, `localePrefix: always`, messages in `apps/web/src/messages/{bn,en}.json`.
- **Tests:** Vitest (bengali 61, game-engine 122), Playwright e2e (101 specs) against `next dev`.

## 2. Routes (all under `/[locale]`)

`/` home, `/today`, `/calendar`, `/puja`, `/play`, `/play/shobdoshakti` (+ `/how-to-play`), `/quiz`, `/quiz/daily`, `/quiz/level/[level]`, `/quiz/level/[level]/[set]`, `/quiz/challenge`, `/leaderboard`, `/learn`, `/learn/[lessonId]`, `/learn/alphabet`, `/discover` (placeholder), `/theke-adda`, `/theke-adda/[id]`, `/moderation`, `/login`, `/account`. API: `/api/quiz/set/[level]/[set]`, `/api/shobdoshakti/*`, `/api/og`.

## 3. Existing game logic

- **শব্দজাল (Level Mode):** 1,000-level dataset; each combination is a letter multiset plus `canForm` words. `useWordJaalGame` (progress in localStorage), components `WordJaalGame`, `LetterPalette`, `WordBuilder`, `FoundWordsList`, `WordJaalActions`, `LevelProgress`, `WordJaalLevelComplete`. Scoring `scoreWordJaalWord`, validation `checkWordJaalGuess` (grapheme-aware, `@alapon/bengali`).
- **Free Play:** 15x15 board (`FreePlayGame`, `useFreePlayGame`, board/tile bag/score/validateMove engines).
- **Missing:** a Daily Challenge (same puzzle for everyone), a result screen (only "level complete"), Word DNA, ranking.

## 4. Reusable components

- **Chrome:** `MegaMenu`, `UserMenu`, `LocaleSwitcher`, `SiteFooter`, `WelcomeBanner`, `NavigationProgress`, `Spinner`.
- **Home/Today:** `HomeDailyQuiz`, `HomeCalendarWidget`, `HomeEditorial`, `TodayPageContent`, `BengaliDateCard`, `FestivalSpotlight`, `PujaHub`.
- **Quiz:** `QuizQuestionCard`, `QuizResult`, `ShareResultButton`, `ChallengePlayer`. **Learn:** `LearnHome`, `LessonPlayer`, `AlphabetChart`, `useSpeech`. **Adda:** `AddaHome`, `PostThread`, `ReportButton`, `LikeButton`, `ModerationQueue`.
- **UI package:** `Button` (unused!), `Card`, `Container`, `Badge`, `SectionHeading`, `AlponaDivider`, `PlaceholderPanel`, `LanguageSwitcher`.

## 5. Design tokens

Tailwind palette from `packages/config/tailwind-tokens.js`: `sindoor` (Bengal red, primary), `marigold` (muted gold), `shapla` (green, success), `alpona` (terracotta), `cream` (ivory grounds), `ink` (warm neutrals, also dark-mode grounds). Fonts: Noto Sans Bengali (UI), Noto Serif Bengali (display), Inter (Latin). Radius: `rounded-alpona` (1.25rem). Dark mode via `prefers-color-scheme`. Background: faint saffron glow + dotted lattice in `globals.css`.

## 6. Responsive strategy

Mobile-first Tailwind breakpoints; header switches to a hamburger below `lg`; games stack on mobile (verified at 320-1440px by e2e). No bottom navigation yet.

## 7. UX inconsistencies found

1. **Buttons:** the primary-button class string is copy-pasted in 20 files; the `@alapon/ui` `Button` is imported nowhere. Sizes/paddings differ (min-h 11 vs 12, px 5/6/7/8).
2. **Cards:** bordered `Card` is used for almost everything, so nothing has hierarchy (the brief asks for editorial rhythm, not card walls).
3. **Navigation:** three mega-menu groups hide the main destinations; quiz, calendar, puja, leaderboard compete with learn/play/adda at the same level; no search; no bottom nav on mobile.
4. **Homepage:** correct content but no clear "what can I do today" spine; the daily quiz, editorial, calendar and feature cards are equal-weight sections.
5. **ShobdoShakti:** Level Mode and Free Play sit behind a toggle on one page; no Daily Challenge; the end of a level has no summary, no word learning, no share.
6. **Word knowledge is disconnected:** the word game, Learn course and daily word share no data model, so a word found in a game cannot be explained.
7. **No progression concept** beyond per-feature stars/XP; nothing ties play, learning and discovery together.
8. **Discover** is a "coming soon" placeholder.
9. **Analytics:** none. **Admin:** only the moderation queue.
10. Two motion libraries' worth of ad-hoc transitions are not used consistently (framer-motion only in `WelcomeBanner`).

## 8. Mobile UX issues

- Primary navigation needs a hamburger tap; thumb reach is poor.
- Game controls are large enough (tested at 320px) but there is no sticky action row.
- Long-word text overflow was fixed for the Learn screens; other screens rely on wrapping.

## 9. Missing functionality (vs the V1.5 brief)

Daily 5, Daily Challenge, result screen, Word DNA, saved words, Bengal Passport, profile page, settings page, search, Discover content model and pages, festival pages, Today's Adda prompt, admin content system, analytics events, structured data, share cards for games.

## 10. Recommended implementation order

As in `docs/ALAPON_V1_5_PROGRESS.md`: design tokens -> navigation -> homepage -> Today -> Daily 5 -> game modes + Daily Challenge -> result -> Word DNA -> passport/profile -> learn/discover/adda/festival integration -> share cards -> mobile/a11y/SEO/analytics -> admin -> performance -> docs.
