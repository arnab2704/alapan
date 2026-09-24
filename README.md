# Alapon (আলাপন)

**Our roots. Always with us.** A Bengali-first digital home for culture,
play and language.

This is the **V0.1 foundation**, with **ShobdoShakti (শব্দশক্তি)** - a
15x15 Bengali word-board game with its own identity, 1,000-level campaign,
and an open Free Play board - as the flagship. Also included: website
shell, Bengali/English i18n, a "Modern Bengal" design system, homepage,
and placeholder pages for Discover and Theke Adda. See
[`docs/architecture/v0.1-foundation.md`](docs/architecture/v0.1-foundation.md)
for the full architecture, and [`ALAPON_FIRST_DRAFT.md`](ALAPON_FIRST_DRAFT.md)
for the long-term product vision this pass intentionally does not build yet.

## Requirements

- Node.js >= 18.18
- No global package manager required - this repo uses npm workspaces.

## Getting started

```bash
npm install
npm run dev          # apps/web on http://localhost:3000
```

Visiting `/` redirects to `/bn` (Alapon is Bengali-first; switch to English
via the header toggle).

## Project layout

```
apps/web/               Next.js 14 App Router site (ShobdoShakti UI in src/components/shobdoshakti/)
packages/bengali/        Bengali normalization, grapheme, tokenization and numeral engine
packages/game-engine/    Framework-agnostic word-board engine (board, scoring, levels dataset)
packages/ui/             Design system components
packages/types/          Shared TypeScript types
packages/config/         Shared design tokens
database/                Prisma schema + seed script (V0.1-scoped tables)
docs/architecture/       Architecture notes
tests/e2e/                Homepage/site-shell Playwright specs
tests/shobdoshakti/       Game-flow, responsive and accessibility Playwright specs
```

## Scripts

| Command                         | What it does                                        |
| ------------------------------- | --------------------------------------------------- |
| `npm run dev`                   | Start the Next.js dev server                        |
| `npm run build`                 | Production build of `apps/web`                      |
| `npm test`                      | Run unit tests across all packages (Vitest)         |
| `npx playwright test`           | Run end-to-end tests (starts the dev server itself) |
| `npm run lint -w apps/web`      | Lint the web app                                    |
| `npm run typecheck -w apps/web` | Typecheck the web app                               |
| `npm run format`                | Format the codebase with Prettier                   |
| `npm run format:check`          | Check formatting without writing                    |

## Database

```bash
cp .env.example .env          # fill in a real DATABASE_URL
npm run generate -w database  # generate the Prisma client
npm run migrate:dev -w database
npm run seed -w database      # seeds a small sample dictionary
```

The schema (`database/schema/schema.prisma`) is intentionally scoped to
what this pass needs - users, dictionary/content provenance, games and game
sessions. No posts/comments/business/payment tables yet.

## What's not built yet (on purpose)

Business directory, creator marketplace, payments, a full social feed,
unrestricted Theke Adda, native mobile apps, complex AI, and advertising are
all out of scope for V0.1. The folder structure and database schema leave
room for them without requiring a rewrite - see the architecture doc's
"deliberately deferred" section.
