# Copyright and provenance

## Source classes

`PUBLIC_DOMAIN`, `OPEN_LICENSE`, `CREATIVE_COMMONS`, `COMMERCIAL_LICENSE`, `USER_SUBMITTED`, `INTERNAL`. **`UNKNOWN` must never reach production.** The table `content_sources` (migration 0006) enforces this with a check constraint; `media_assets` records uploader, rights type, owner, licence, permission reference and status for every asset.

## Current content

- Word bank, discoveries, festival data and prompts are written for Alapon ("Alapon editorial"), factual summaries only. No dictionary or dataset has been copied from a commercial source. Before importing any dictionary, add a `content_sources` row and confirm the licence.
- Images: the homepage banner and any artwork must have a recorded source and licence. Keep `docs/ASSET_CREDITS.md` (create it when the first third-party asset is added).
- ShobdoShakti level data comes from the project's own datasets; the owner should confirm its provenance.

## User content rules

Users may post only what they created or may share. Full books, articles, songs, film clips, pirated PDFs and other people's photos or artwork are prohibited (Terms, Copyright Policy). The app has no file-upload feature yet; before adding one, wire it to `media_assets` and require a rights declaration.

## Claim workflow (implemented)

1. `/report-copyright` inserts a `copyright_claims` row (status `received`).
2. A moderator or admin opens `/admin` -> "Copyright claims and appeals" and chooses **Restrict** (temporary), **Uphold** or **Reject**, with an optional note.
3. Each decision calls `log_moderation_action` (audit log).
4. Notifying the claimant is manual today (their email is in the row); automate with a transactional email provider.
5. The affected user can appeal from their account page (`appeals`).

Repeat infringers: suspend via the moderation tools. Notice-and-takedown requirements differ by country; obtain legal review (for example DMCA designated-agent registration if serving the US).
