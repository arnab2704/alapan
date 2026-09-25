# Roadmap after V1.5

1. Ranking on the result screen (tables ready in migration 0005; write `game_results` on completion, call `daily_rank`).
2. Sync Daily 5 / passport to the account when signed in (currently device-local).
3. Admin: CRUD for words, discoveries, festivals, Adda prompts (today: counts + Daily Challenge scheduling only).
4. Image share cards (needs a Bengali-capable renderer; Satori cannot shape vowel signs).
5. Expand the word bank beyond ~150 curated words; curate the ShobdoShakti dataset to remove fragment words.
6. Festival pages: per-day story/food/music/quiz content (currently dates, days, passport link).
7. `lesson_started`, `signup_*` events; connect a real analytics provider.
8. Yearly festival date refresh; more discoveries (target 100+).
   Not planned (by design): AI chatbot, multiplayer, payments, ads.

## Still not built (production follow-ups)

- Redis leaderboard cache, Payload CMS, R2 uploads, Stripe/Razorpay, Sentry SDK (add DSN wiring), business and events directories, creator tools, diaspora events, automated abuse scoring, transactional email for claims and appeals, image share cards.
- Legal review of `legalContent.ts` and the compliance docs before public launch.
