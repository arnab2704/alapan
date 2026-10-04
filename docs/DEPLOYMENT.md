# Deployment and launch checklist

## Environment (`apps/web/.env.local` or host settings)

| Variable                                                    | Purpose                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Accounts, Adda, scores, admin (RLS protects data; the anon key is public by design)          |
| `NEXT_PUBLIC_SITE_URL`                                      | Canonical URLs, sitemap, Open Graph; set to the real https origin                            |
| `NEXT_PUBLIC_POSTHOG_KEY` (+ `NEXT_PUBLIC_POSTHOG_HOST`)    | Optional product analytics (off if unset)                                                    |
| `NEXT_PUBLIC_ANALYTICS_DEBUG=1`                             | Log events to the console (development)                                                      |
| `SUPABASE_SERVICE_ROLE_KEY`                                 | **Server/ops only**, for completing account deletions. Never `NEXT_PUBLIC_`, never committed |

## Database

Apply `database/migrations/0001` to `0006` in order in the Supabase SQL editor (idempotent). Then promote your first admin:

```sql
update public.profiles set role = 'admin' where id = '<your user id>';
```

Confirm RLS is enabled on every table:

```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public';
```

## Hosting notes

The GitHub repository is public. On Vercel's free Hobby plan, a private repo only deploys when the pushing commit's author email is verified on the GitHub account connected to the Vercel project ("Deployment Blocked: commit author did not have contributing access"); a public repo has no such restriction. If the repo is made private again later, either upgrade to Vercel Pro or make sure commit authors use a verified email on that GitHub account.

## Build and run

`npm ci && npm run build -w apps/web && npm run start -w apps/web` (Node 20+). Host on Vercel, Cloudflare or any Node host. Locally, build into an isolated folder with `NEXT_DIST_DIR=.next-verify` so a running dev server is not disturbed.

## Built-in production features

Security headers (nosniff, frame, referrer, permissions, HSTS), PWA manifest and offline service worker (`public/sw.js`, production only), error boundaries, real 404s, sitemap and robots, structured data, `noindex` on personal pages.

## Account deletion (operator task, within 30 days)

```sql
select user_id, requested_at from public.deletion_requests where status = 'pending' order by requested_at;
```

For each user, delete via the Supabase Admin API (`auth.admin.deleteUser(id)`) using the service role; related rows cascade. Then mark the request completed if its row still exists.

## Launch checklist

- [ ] Counsel reviewed Terms, Privacy, Copyright, Safety; operator name, contact and jurisdiction added
- [ ] `NEXT_PUBLIC_SITE_URL` set; sitemap reachable; custom domain and HTTPS
- [ ] Migrations 0001 to 0006 applied; first admin promoted; RLS verified
- [ ] Supabase Auth: email templates, redirect URLs, rate limits, email confirmation on
- [ ] Error monitoring attached (Sentry or host logs) and alerts configured
- [ ] Analytics provider decision and consent wording if required
- [ ] Backups / point-in-time recovery enabled on the database
- [ ] Asset licences recorded (`docs/ASSET_CREDITS.md`)
- [ ] Full Playwright suite run against a production build
- [ ] `npm audit` reviewed and CI green

## Not built (see roadmap)

Redis or leaderboard cache, Payload CMS, R2 uploads, payments, business and events directories, creator tools, automated abuse scoring, email notifications.
