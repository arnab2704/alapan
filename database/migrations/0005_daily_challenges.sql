-- ALAPON V1.5: editor-scheduled Daily Challenge + saved game results.
-- Apply in the Supabase SQL editor (idempotent). Requires 0001 (profiles, is_moderator).

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- One row per date. Only 'published' rows are readable by the public; the app falls back to the
-- deterministic daily puzzle when a date has no published row.
create table if not exists public.daily_challenges (
  day date primary key,
  -- [{ "level": 1..N, "index": 0..M }, ...] exactly the game-engine DailyRoundSpec
  rounds jsonb not null check (jsonb_typeof(rounds) = 'array' and jsonb_array_length(rounds) between 1 and 5),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists daily_challenges_touch on public.daily_challenges;
create trigger daily_challenges_touch before update on public.daily_challenges
  for each row execute function public.touch_updated_at();

alter table public.daily_challenges enable row level security;

drop policy if exists daily_challenges_read_published on public.daily_challenges;
create policy daily_challenges_read_published on public.daily_challenges
  for select using (status = 'published' or public.is_admin());

drop policy if exists daily_challenges_admin_write on public.daily_challenges;
create policy daily_challenges_admin_write on public.daily_challenges
  for all using (public.is_admin()) with check (public.is_admin());

-- One completed Daily Challenge per user per day, for ranking. Written by users for themselves.
create table if not exists public.game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  score int not null check (score >= 0 and score <= 100000),
  words_count int not null check (words_count >= 0 and words_count <= 1000),
  created_at timestamptz not null default now(),
  unique (user_id, day)
);

alter table public.game_results enable row level security;

drop policy if exists game_results_read on public.game_results;
create policy game_results_read on public.game_results for select using (true);

drop policy if exists game_results_insert_own on public.game_results;
create policy game_results_insert_own on public.game_results
  for insert with check (user_id = auth.uid());

-- Rank of a score among everyone who played a given day (1 = best). Anonymous-safe: no user data.
create or replace function public.daily_rank(p_day date, p_score int)
returns table (rank bigint, players bigint)
language sql stable security definer set search_path = public as $$
  select 1 + count(*) filter (where score > p_score), count(*) from public.game_results where day = p_day;
$$;
grant execute on function public.daily_rank(date, int) to anon, authenticated;
