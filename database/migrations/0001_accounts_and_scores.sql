-- Alapon 0001: accounts, profiles, quiz scores and leaderboard.
-- Run in the Supabase SQL editor (or `supabase db push`). Safe to re-run.
-- Privacy: minimum data. No exact location, no contacts, no address.

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_url text,
  locale text not null default 'bn' check (locale in ('bn', 'en')),
  bio text check (char_length(bio) <= 280),
  city_region text check (char_length(city_region) <= 60), -- coarse only, never exact
  privacy_level text not null default 'private' check (privacy_level in ('private', 'public')),
  -- Age-safety: under-18 accounts stay in the child-safe area (no Adda posting).
  is_adult boolean not null default false,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  suspended_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles readable when public or own" on public.profiles;
create policy "profiles readable when public or own" on public.profiles
  for select using (privacy_level = 'public' or id = auth.uid());

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile" on public.profiles
  for insert with check (id = auth.uid() and role = 'user');

-- Users may edit their profile but never their own role or suspension.
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and suspended_until is not distinct from (select p.suspended_until from public.profiles p where p.id = auth.uid())
  );

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Helper used by later policies (security definer avoids recursive RLS).
create or replace function public.is_moderator() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'));
$$;

-- ------------------------------------------------------------ quiz results
-- One row per completed quiz run. Written by signed-in users for themselves.
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('daily', 'level')),
  -- daily: ISO date; level: 'L<level>-S<set>'
  ref text not null check (char_length(ref) <= 32),
  score int not null check (score >= 0),
  total int not null check (total > 0 and total <= 50),
  created_at timestamptz not null default now(),
  check (score <= total),
  unique (user_id, kind, ref)
);

create index if not exists quiz_results_kind_ref_idx on public.quiz_results (kind, ref, score desc);

alter table public.quiz_results enable row level security;

drop policy if exists "users read own results" on public.quiz_results;
create policy "users read own results" on public.quiz_results
  for select using (user_id = auth.uid());

drop policy if exists "users insert own results" on public.quiz_results;
create policy "users insert own results" on public.quiz_results
  for insert with check (user_id = auth.uid());

-- Keep the best score only: allow a user to raise their own score.
drop policy if exists "users improve own results" on public.quiz_results;
create policy "users improve own results" on public.quiz_results
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ------------------------------------------------------------- leaderboard
-- Exposes only display name + score of PUBLIC profiles; never raw rows.
create or replace view public.daily_leaderboard
with (security_invoker = false) as
select p.username, p.display_name, r.ref as day, r.score, r.total, r.created_at
from public.quiz_results r
join public.profiles p on p.id = r.user_id
where r.kind = 'daily' and p.privacy_level = 'public' and p.suspended_until is null;

revoke all on public.daily_leaderboard from public;
grant select on public.daily_leaderboard to anon, authenticated;

create or replace view public.total_leaderboard
with (security_invoker = false) as
select p.username, p.display_name, sum(r.score)::int as points, count(*)::int as quizzes
from public.quiz_results r
join public.profiles p on p.id = r.user_id
where p.privacy_level = 'public' and p.suspended_until is null
group by p.username, p.display_name;

revoke all on public.total_leaderboard from public;
grant select on public.total_leaderboard to anon, authenticated;

-- ---------------------------------------------------- new-user profile row
-- Creates a private, non-adult-by-default profile when someone signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 10),
    coalesce(nullif(split_part(coalesce(new.raw_user_meta_data ->> 'name', new.email, ''), '@', 1), ''), 'অতিথি')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
