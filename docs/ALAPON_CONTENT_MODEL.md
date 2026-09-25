# Content model

Content is typed data in `packages/bengali/src/data` (versioned with code) plus Supabase for editor-scheduled and community data.

| Entity             | Source                                                                                | Notes                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Word (`WordEntry`) | `word-bank.ts` (~90 curated) + `word-bank-vocab.ts` (course vocabulary) + daily words | Meaning bn/en, pronunciation, category, difficulty (`estimateDifficulty`), cultural note, related words. Any Bengali word gets a basic DNA page, noindex when uncurated. |
| DailyChallenge     | deterministic + Supabase `daily_challenges`                                           | `day` PK, `rounds jsonb [{level,index}]`, `difficulty`, `status draft/published`. Public reads published only; admin writes (RLS `is_admin()`).                          |
| Question           | quiz data (`packages/game-engine` quiz)                                               | Daily question chosen from the date.                                                                                                                                     |
| Lesson             | learn course data                                                                     | Words link to Word DNA; completion recorded in the passport.                                                                                                             |
| Discovery          | `discoveries.ts` (~26 authored + generated people/history)                            | category person/place/history/literature/food/song, bn/en title+summary, `source`, `relatedWords`, related slugs. Integrity tested.                                      |
| Festival           | `festivals.ts`                                                                        | Dated for autumn 2026 - autumn 2027; lunisolar dates flagged (regional variation stated neutrally). Re-source yearly.                                                    |
| Adda prompt        | `adda-prompts.ts` (30)                                                                | Rotates by date.                                                                                                                                                         |
| Post/Comment       | Supabase (0002-0004)                                                                  | Community, moderated.                                                                                                                                                    |

Adding content: edit the data file, run `npx vitest run packages` (integrity + coverage tests). Scheduling a specific Daily Challenge needs no deploy: `/admin`.

## Sharodiya 1433 (Durga Puja 2026) content

Date-targeted, so the festival days are curated instead of random:

- `packages/game-engine/src/data/puja-quiz.ts`: 60 questions (10 each for Mahalaya 10 Oct and Shashthi to Dashami 17-21 Oct). `getDailyQuiz` draws its five questions from the day's set on those dates.
- `packages/bengali/src/data/festive-daily.ts`: 12 dated daily words (10-21 Oct) and 20 dated Adda prompts (10-29 Oct). `getDailyWord` and `getAddaPrompt` check these first.
- `packages/bengali/src/data/word-bank-puja.ts`: 20 Puja words with cultural notes in the Word DNA bank.
- `packages/bengali/src/data/discoveries.ts`: 15 Puja discoveries (dhak, dhunuchi, Sindoor Khela, Nabapatrika, Sandhi Puja, Kumari Puja, Bodhon, pandal-hopping, barowari, bhog, daker saaj, new clothes, Bijoya, Agomoni, Chandannagar).

All of it is draft content by Alapon editorial and **must be reviewed by a native-speaking reviewer before launch**. Tests: `puja-quiz.test.ts`, `festive.test.ts`.

### Second festive batch (Oct-Nov 2026)

- `festive-quiz-2.ts`: a shared 18-question countdown pool for 11-16 Oct, plus 10-question sets for Kojagari Lakshmi Puja (25 Oct), Kali Puja (8 Nov), Bhai Phota (10 Nov) and Jagaddhatri Puja (17 Nov).
- `festive-daily-2.ts`: 12 dated daily words and 19 dated Adda prompts (30 Oct to 17 Nov).
- `word-bank-kartik.ts`: 13 words; 7 more discoveries (Kojagari, Dakshineswar, Kalighat, Bhoot Chaturdashi, Bhai Phota, Jagaddhatri, Shyama Sangeet).

## Scope decision: no Bangladesh-specific content

Questions, history events and entries whose subject is the country of Bangladesh (its capital and cities, national symbols, 1971, the Language Movement, cricket, metro and so on) were removed from the level quiz bank, the daily quiz pool, the history calendar and the editorial seeds. The level quiz is now about 880 questions (test floors: 850 total, 70 per level, sets of 7-12). Refill with West Bengal and shared-heritage questions when reviewed content is available. Originals remain in git history (first commit).
