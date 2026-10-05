-- ALAPON: view counts for Theke Adda posts.
-- Apply in the Supabase SQL editor (idempotent). Requires 0002 and 0003 (posts, post_feed).

alter table public.posts add column if not exists view_count bigint not null default 0;

-- Bumps a post's view count. security definer so any visitor (signed in or not) can call it
-- through RLS, without granting anyone update access to posts directly; only touches
-- view_count on published, non-removed posts, and does nothing for anything else.
create or replace function public.increment_post_view(p_post_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.posts
  set view_count = view_count + 1
  where id = p_post_id and status = 'published' and moderation_status <> 'removed';
end $$;

grant execute on function public.increment_post_view(uuid) to anon, authenticated;

-- Recreate the public feed view to also expose view_count (see 0003 for the base definition).
-- Postgres only allows CREATE OR REPLACE VIEW to append new output columns at the end, not
-- reorder or rename existing ones - so view_count is added last, after comment_count.
create or replace view public.post_feed
with (security_invoker = false) as
select
  p.id, p.author_id, pr.username as author_username, pr.display_name as author_display_name,
  p.category_slug, p.title, p.body, p.created_at,
  (
    select count(*) from public.comments c
    where c.post_id = p.id and c.status = 'published' and c.moderation_status <> 'removed'
  )::int as comment_count,
  p.view_count
from public.posts p
join public.profiles pr on pr.id = p.author_id
where p.status = 'published'
  and p.moderation_status <> 'removed'
  and (pr.suspended_until is null or pr.suspended_until < now())
  and not public.is_hidden_from_me(p.author_id);

revoke all on public.post_feed from public;
grant select on public.post_feed to anon, authenticated;
