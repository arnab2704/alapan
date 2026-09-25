-- ALAPON production readiness: copyright claims, content provenance, appeals, account deletion requests.
-- Idempotent. Requires 0001 (profiles, is_moderator), 0002 (moderation_audit_log), 0005 (is_admin).

-- ------------------------------------------------------------ content sources
-- Every imported cultural/dictionary asset should trace back to a row here. UNKNOWN is never
-- allowed in production data.
create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null check (char_length(source_name) between 1 and 200),
  source_url text check (char_length(source_url) <= 500),
  license text not null check (
    license in ('PUBLIC_DOMAIN', 'OPEN_LICENSE', 'CREATIVE_COMMONS', 'COMMERCIAL_LICENSE', 'USER_SUBMITTED', 'INTERNAL')
  ),
  rights_status text not null default 'cleared' check (rights_status in ('cleared', 'pending_review', 'restricted')),
  retrieved_at date,
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);

-- Rights metadata for anything users or editors upload.
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid references public.profiles (id) on delete set null,
  asset_type text not null check (asset_type in ('image', 'audio', 'video', 'text', 'other')),
  source_id uuid references public.content_sources (id),
  rights_type text not null check (rights_type in ('own_work', 'licensed', 'public_domain', 'creative_commons', 'permission')),
  copyright_owner text check (char_length(copyright_owner) <= 200),
  license text check (char_length(license) <= 100),
  permission_reference text check (char_length(permission_reference) <= 300),
  status text not null default 'active' check (status in ('active', 'restricted', 'removed')),
  created_at timestamptz not null default now()
);

alter table public.content_sources enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists content_sources_read on public.content_sources;
create policy content_sources_read on public.content_sources for select using (true);
drop policy if exists content_sources_admin on public.content_sources;
create policy content_sources_admin on public.content_sources
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists media_assets_read on public.media_assets;
create policy media_assets_read on public.media_assets for select using (status = 'active' or public.is_moderator());
drop policy if exists media_assets_insert_own on public.media_assets;
create policy media_assets_insert_own on public.media_assets
  for insert with check (uploader_id = auth.uid());
drop policy if exists media_assets_moderate on public.media_assets;
create policy media_assets_moderate on public.media_assets
  for update using (public.is_moderator()) with check (public.is_moderator());

-- ---------------------------------------------------------- copyright claims
-- Claim -> content id -> temporary restriction -> review -> decision -> notification -> audit log.
create table if not exists public.copyright_claims (
  id uuid primary key default gen_random_uuid(),
  claimant_name text not null check (char_length(claimant_name) between 2 and 200),
  claimant_email text not null check (claimant_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(claimant_email) <= 200),
  content_url text not null check (char_length(content_url) between 5 and 500),
  original_work text not null check (char_length(original_work) between 5 and 1000),
  statement text not null check (char_length(statement) between 10 and 2000),
  good_faith boolean not null check (good_faith),
  status text not null default 'received' check (
    status in ('received', 'restricted', 'under_review', 'upheld', 'rejected', 'counter_notice')
  ),
  decision_note text check (char_length(decision_note) <= 1000),
  reporter_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id)
);
create index if not exists copyright_claims_status_idx on public.copyright_claims (status, created_at);

alter table public.copyright_claims enable row level security;

-- Anyone (signed in or not) can file a claim; only moderators can read or decide.
drop policy if exists copyright_claims_insert on public.copyright_claims;
create policy copyright_claims_insert on public.copyright_claims
  for insert with check (
    status = 'received' and decided_at is null and decided_by is null and decision_note is null
    and (reporter_id is null or reporter_id = auth.uid())
  );
drop policy if exists copyright_claims_mod_read on public.copyright_claims;
create policy copyright_claims_mod_read on public.copyright_claims for select using (public.is_moderator());
drop policy if exists copyright_claims_mod_update on public.copyright_claims;
create policy copyright_claims_mod_update on public.copyright_claims
  for update using (public.is_moderator()) with check (public.is_moderator());

-- ------------------------------------------------------------------ appeals
create table if not exists public.appeals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null check (subject in ('post_removed', 'comment_removed', 'suspension', 'copyright')),
  reference text check (char_length(reference) <= 200),
  message text not null check (char_length(message) between 10 and 1500),
  status text not null default 'open' check (status in ('open', 'upheld', 'overturned')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id)
);
alter table public.appeals enable row level security;
drop policy if exists appeals_own_insert on public.appeals;
create policy appeals_own_insert on public.appeals
  for insert with check (user_id = auth.uid() and status = 'open');
drop policy if exists appeals_read on public.appeals;
create policy appeals_read on public.appeals for select using (user_id = auth.uid() or public.is_moderator());
drop policy if exists appeals_mod_update on public.appeals;
create policy appeals_mod_update on public.appeals
  for update using (public.is_moderator()) with check (public.is_moderator());

-- ------------------------------------------------- account deletion requests
-- Deleting an auth user needs the service role, so the app records the request and an operator (or a
-- scheduled job using the service key) completes it within the retention window in docs/compliance.
create table if not exists public.deletion_requests (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  requested_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled'))
);
alter table public.deletion_requests enable row level security;
drop policy if exists deletion_requests_own on public.deletion_requests;
create policy deletion_requests_own on public.deletion_requests
  for all using (user_id = auth.uid()) with check (user_id = auth.uid() and status in ('pending', 'cancelled'));
drop policy if exists deletion_requests_admin_read on public.deletion_requests;
create policy deletion_requests_admin_read on public.deletion_requests for select using (public.is_admin());
