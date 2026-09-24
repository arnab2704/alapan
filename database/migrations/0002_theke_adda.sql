-- Alapon 0002: Theke Adda (curated discussion), reports, blocks and moderation audit.
-- Depends on 0001. Safe to re-run.
-- Design: every user-generated object carries a moderation status; nothing is
-- published by AI alone; reports, blocks and an audit log exist from day one.
-- No direct messaging tables, by decision.

create table if not exists public.adda_categories (
  slug text primary key,
  name_bn text not null,
  name_en text not null,
  sort_order int not null default 0
);

insert into public.adda_categories (slug, name_bn, name_en, sort_order) values
  ('aajker-adda', 'আজকের আড্ডা', 'Today''s Adda', 1),
  ('motamot', 'মতামত', 'Opinions', 2),
  ('hashir-adda', 'হাসির আড্ডা', 'Humour', 3),
  ('golper-asor', 'গল্পের আসর', 'Story circle', 4),
  ('gan-bajna', 'গান-বাজনা', 'Music', 5),
  ('cinema-adda', 'সিনেমা আড্ডা', 'Cinema', 6),
  ('khawa-dawa', 'খাওয়া-দাওয়া', 'Food', 7),
  ('probasher-adda', 'প্রবাসের আড্ডা', 'Diaspora', 8),
  ('pujor-adda', 'পুজোর আড্ডা', 'Puja', 9)
on conflict (slug) do nothing;

alter table public.adda_categories enable row level security;
drop policy if exists "categories readable" on public.adda_categories;
create policy "categories readable" on public.adda_categories for select using (true);

-- ------------------------------------------------------------------ posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  category_slug text not null references public.adda_categories (slug),
  title text not null check (char_length(title) between 3 and 140),
  body text not null check (char_length(body) between 1 and 5000),
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted')),
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'flagged', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_feed_idx on public.posts (category_slug, created_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted')),
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'flagged', 'removed')),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

create table if not exists public.reactions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id uuid not null,
  kind text not null default 'like' check (kind in ('like', 'haha', 'love', 'thoughtful')),
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  muted_only boolean not null default false, -- true = mute, false = block
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment', 'profile', 'copyright')),
  target_id uuid not null,
  reason text not null check (reason in ('spam', 'abuse', 'hate', 'unsafe', 'copyright', 'other')),
  description text check (char_length(description) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id)
);
create index if not exists reports_queue_idx on public.reports (status, priority, created_at);

create table if not exists public.moderation_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id),
  action text not null,
  target_type text not null,
  target_id uuid,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------- can-post helper
-- Only adult, non-suspended accounts may post or comment (child-safe design).
create or replace function public.can_participate() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_adult and (suspended_until is null or suspended_until < now())
  );
$$;

-- Hide content from people the reader has blocked or muted.
create or replace function public.is_hidden_from_me(author uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.blocks where blocker_id = auth.uid() and blocked_id = author);
$$;

-- -------------------------------------------------------------------- RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_audit_log enable row level security;

-- Posts
drop policy if exists "read published posts" on public.posts;
create policy "read published posts" on public.posts for select using (
  (status = 'published' and moderation_status <> 'removed' and not public.is_hidden_from_me(author_id))
  or author_id = auth.uid() or public.is_moderator()
);
drop policy if exists "adults create posts" on public.posts;
create policy "adults create posts" on public.posts for insert with check (
  author_id = auth.uid() and public.can_participate() and status = 'published' and moderation_status = 'pending'
);
drop policy if exists "authors edit or delete own posts" on public.posts;
create policy "authors edit or delete own posts" on public.posts for update
  using (author_id = auth.uid()) with check (author_id = auth.uid() and moderation_status = 'pending');
drop policy if exists "moderators manage posts" on public.posts;
create policy "moderators manage posts" on public.posts for update
  using (public.is_moderator()) with check (public.is_moderator());

-- Comments
drop policy if exists "read published comments" on public.comments;
create policy "read published comments" on public.comments for select using (
  (status = 'published' and moderation_status <> 'removed' and not public.is_hidden_from_me(author_id))
  or author_id = auth.uid() or public.is_moderator()
);
drop policy if exists "adults create comments" on public.comments;
create policy "adults create comments" on public.comments for insert with check (
  author_id = auth.uid() and public.can_participate() and status = 'published' and moderation_status = 'pending'
);
drop policy if exists "authors edit own comments" on public.comments;
create policy "authors edit own comments" on public.comments for update
  using (author_id = auth.uid()) with check (author_id = auth.uid() and moderation_status = 'pending');
drop policy if exists "moderators manage comments" on public.comments;
create policy "moderators manage comments" on public.comments for update
  using (public.is_moderator()) with check (public.is_moderator());

-- Reactions (own only)
drop policy if exists "reactions readable" on public.reactions;
create policy "reactions readable" on public.reactions for select using (true);
drop policy if exists "adults react" on public.reactions;
create policy "adults react" on public.reactions for insert with check (user_id = auth.uid() and public.can_participate());
drop policy if exists "remove own reaction" on public.reactions;
create policy "remove own reaction" on public.reactions for delete using (user_id = auth.uid());

-- Blocks (private to the blocker)
drop policy if exists "manage own blocks" on public.blocks;
create policy "manage own blocks" on public.blocks for all
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- Reports: any signed-in user may file; reporters see their own; moderators see all.
drop policy if exists "signed-in users file reports" on public.reports;
create policy "signed-in users file reports" on public.reports for insert with check (
  reporter_id = auth.uid() and status = 'open' and resolved_by is null
);
drop policy if exists "read own reports or moderator" on public.reports;
create policy "read own reports or moderator" on public.reports for select using (
  reporter_id = auth.uid() or public.is_moderator()
);
drop policy if exists "moderators resolve reports" on public.reports;
create policy "moderators resolve reports" on public.reports for update
  using (public.is_moderator()) with check (public.is_moderator());

-- Audit log: moderators read; writes happen via the function below only.
drop policy if exists "moderators read audit log" on public.moderation_audit_log;
create policy "moderators read audit log" on public.moderation_audit_log for select using (public.is_moderator());

create or replace function public.log_moderation_action(
  p_action text, p_target_type text, p_target_id uuid, p_detail jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_moderator() then raise exception 'not allowed'; end if;
  insert into public.moderation_audit_log (actor_id, action, target_type, target_id, detail)
  values (auth.uid(), p_action, p_target_type, p_target_id, p_detail);
end $$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();
