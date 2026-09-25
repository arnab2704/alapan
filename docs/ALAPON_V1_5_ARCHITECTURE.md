# Alapon V1.5 architecture

Promise: "A few minutes with Bengal, every day." Core loop: Open -> Today -> Daily 5 -> Daily Word -> ShobdoShakti -> Result -> Word DNA -> Learn -> Bengal Passport -> "see you tomorrow".

## Stack

Next.js 14 App Router, next-intl (`bn` default, `en`, prefix always), Tailwind tokens, framer-motion, Supabase (Auth, Postgres, RLS), Vitest, Playwright. npm workspaces: `apps/web`, `packages/{bengali,game-engine,ui,config}`.

## Principle: local-first, deterministic, no frozen dates

- "Today" is resolved client-side (`components/calendar/useToday`), never at build time.
- Daily content (word, question, discovery, learning moment, Adda prompt, daily challenge) is derived deterministically from the date, so every visitor sees the same day without a database.
- Progress (Daily 5, passport, saved words, results) lives in `localStorage` (keys `alapon.*.v1`). Accounts add community features only; the daily habit works signed-out.
- Editors can override the daily challenge from `/admin` -> Supabase `daily_challenges`; the API falls back to the deterministic puzzle on any failure.

## Layout of the code

| Area                                       | Where                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Navigation (5 items, bottom bar on mobile) | `components/nav/*`                                                                         |
| Homepage / Today                           | `components/home/*`, `components/today/*`                                                  |
| Daily 5                                    | `lib/daily5.ts`, `components/daily5/*`                                                     |
| ShobdoShakti                               | `packages/game-engine`, `components/shobdoshakti/*`, `app/api/shobdoshakti/daily`          |
| Word DNA                                   | `packages/bengali/src/words.ts`, `data/word-bank*.ts`, `components/word/*`, `/word/[slug]` |
| Passport / profile                         | `lib/passport.ts`, `components/passport/*`, `components/profile/*`                         |
| Discover                                   | `packages/bengali/src/discover.ts`, `data/discoveries.ts`, `components/discover/*`         |
| Festival                                   | `data/festivals.ts`, `components/festival/*`, `/festival/[slug]`, `/puja`                  |
| Adda                                       | `components/adda/*`, `lib/supabase/adda.ts`                                                |
| Admin                                      | `components/admin/AdminPage.tsx`, migration `0005`                                         |

## Routes

`/`, `/today`, `/play`, `/play/shobdoshakti/{daily,free,levels,result/[id],how-to-play}`, `/quiz…`, `/learn…`, `/word/[slug]`, `/discover`, `/discover/[slug]`, `/festival/[slug]`, `/puja`, `/calendar`, `/theke-adda`, `/passport`, `/profile`, `/settings`, `/search`, `/leaderboard`, `/admin`, `/moderation`. Unknown dynamic slugs return a real 404 (no route-level `loading.tsx`, which would commit a 200 first).

## Hydration rules

Never randomise in the initial render (shuffle in `useEffect`). `html[data-hydrated]` is set after mount; e2e helpers wait on it.

## Bengali text

Grapheme-aware everywhere (`packages/bengali`: `splitGraphemes`, `normalizeForSearch`). Satori/OG images cannot shape Bengali vowel signs, so `/api/og` uses only the brand word, digits and English; shares are text.

## SEO

`lib/pageMetadata.ts` for hub pages; `generateMetadata` for discoveries/festivals/words; Article/Event/DefinedTerm JSON-LD; sitemap lists discoveries, festivals and curated words in both locales; personal pages are `noindex`.
