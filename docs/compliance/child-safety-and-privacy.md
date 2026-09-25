# Child safety and privacy

## Model

- **Child-safe public area** (no account needed): games, quizzes, learning, culture, calendar, Passport. None of these collect personal data; progress stays in the browser (`localStorage`, keys `alapon.*`).
- **Adult community area** (Theke Adda): posting, commenting and reacting need an account with `is_adult = true` and no active suspension (`can_participate()` in migration 0002, enforced by RLS, not only in the UI).
- Not built, by decision: direct messages, public child profiles, exact-location features, open follower mechanics, unrestricted photo upload, adult-to-child messaging.
- Profiles are private by default (`privacy_level = 'private'`).

## Data collected (accounts only)

Email (auth), display name, username, adult flag, privacy level, quiz scores, posts/comments/reactions, and the reports and blocks the user makes. No address, phone, contacts, precise location or device fingerprint.

## Analytics

Off unless `NEXT_PUBLIC_POSTHOG_KEY` is set. Events never carry names, emails or free text (`lib/analytics.ts`). The id is session-scoped and random. No advertising cookies or profiling. If ads are added later, child-facing areas must stay ad-free or contextual only, with clear "sponsored" labels.

## User rights (implemented)

- **Export:** Account -> "Download my data" (profile, scores, posts, comments, and this device's `alapon.*` storage) as JSON.
- **Deletion:** Account -> "Delete my account" writes `deletion_requests` (pending). An operator completes it within **30 days** by deleting the `auth.users` row with the service role; profile-owned rows cascade (`on delete cascade`). Steps are in DEPLOYMENT.md. Cancellation is possible while pending.
- **Local data:** Settings -> clear device data.

## Retention (proposed, adjust with counsel)

Reports and the moderation audit log: 12 months after resolution, then review. Copyright claims: 3 years (legal defence). Deletion requests: 12 months after completion.

## Open items for review

Age-assurance strength (the adult flag is self-declared), a children's risk assessment for Ofcom/ICO, a DPIA, a named privacy contact, and a cookie/consent decision if analytics are enabled in the UK/EU.
