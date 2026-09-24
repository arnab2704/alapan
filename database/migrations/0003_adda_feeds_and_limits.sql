-- Alapon 0003: public feed views, rate limits, moderator powers for Theke Adda.
-- Depends on 0001 and 0002. Safe to re-run.

-- Posting implies showing your display name, even if your profile is otherwise private.
-- These views expose only author name/username plus the post itself, and re-apply the
-- visibility rules (published, not removed, author not suspended, not blocked by the reader).
create or replace view public.post_feed
with (security_invoker = false) as
select
  p.id, p.author_id, pr.username as author_username, pr.display_name as author_display_name,
  p.category_slug, p.title, p.body, p.created_at,
  (
    select count(*) from public.comments c
    where c.post_id = p.id and c.status = 'published' and c.moderation_status <> 'removed'
  )::int as comment_count
from public.posts p
join public.profiles pr on pr.id = p.author_id
where p.status = 'published'
  and p.moderation_status <> 'removed'
  and (pr.suspended_until is null or pr.suspended_until < now())
  and not public.is_hidden_from_me(p.author_id);

create or replace view public.comment_feed
with (security_invoker = false) as
select
  c.id, c.post_id, c.author_id, pr.username as author_username, pr.display_name as author_display_name,
  c.body, c.created_at
from public.comments c
join public.profiles pr on pr.id = c.author_id
where c.status = 'published'
  and c.moderation_status <> 'removed'
  and (pr.suspended_until is null or pr.suspended_until < now())
  and not public.is_hidden_from_me(c.author_id);

revoke all on public.post_feed from public;
revoke all on public.comment_feed from public;
grant select on public.post_feed to anon, authenticated;
grant select on public.comment_feed to anon, authenticated;

-- Rate limits (basic spam protection): 5 posts/hour, 30 comments/hour per author.
create or replace function public.enforce_post_rate_limit() returns trigger
language plpgsql as $$
begin
  if (select count(*) from public.posts where author_id = new.author_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limit_posts' using errcode = 'P0001';
  end if;
  return new;
end $$;

create or replace function public.enforce_comment_rate_limit() returns trigger
language plpgsql as $$
begin
  if (select count(*) from public.comments where author_id = new.author_id and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'rate_limit_comments' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists posts_rate_limit on public.posts;
create trigger posts_rate_limit before insert on public.posts
  for each row execute function public.enforce_post_rate_limit();

drop trigger if exists comments_rate_limit on public.comments;
create trigger comments_rate_limit before insert on public.comments
  for each row execute function public.enforce_comment_rate_limit();

-- Moderators can see any profile (to review reports) and suspend accounts.
drop policy if exists "moderators read profiles" on public.profiles;
create policy "moderators read profiles" on public.profiles
  for select using (public.is_moderator());

drop policy if exists "moderators suspend profiles" on public.profiles;
create policy "moderators suspend profiles" on public.profiles
  for update using (public.is_moderator()) with check (public.is_moderator());

-- To make yourself the first moderator (replace the email), run once in the SQL editor:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
