-- Alapon 0004: the Editorial section of Theke Adda.
-- Depends on 0001-0003. Safe to re-run.
-- Only moderators/admins may publish into (or move a post into) the editorial category.

insert into public.adda_categories (slug, name_bn, name_en, sort_order)
values ('editorial', 'সম্পাদকীয়', 'Editorial', 0)
on conflict (slug) do update
  set name_bn = excluded.name_bn, name_en = excluded.name_en, sort_order = excluded.sort_order;

-- Creating a post: editorial is staff-only.
drop policy if exists "adults create posts" on public.posts;
create policy "adults create posts" on public.posts for insert with check (
  author_id = auth.uid()
  and public.can_participate()
  and status = 'published'
  and moderation_status = 'pending'
  and (category_slug <> 'editorial' or public.is_moderator())
);

-- Editing a post: closes the loophole of re-filing an ordinary post as editorial.
drop policy if exists "authors edit or delete own posts" on public.posts;
create policy "authors edit or delete own posts" on public.posts for update
  using (author_id = auth.uid())
  with check (
    author_id = auth.uid()
    and moderation_status = 'pending'
    and (category_slug <> 'editorial' or public.is_moderator())
  );

-- The starter posts written by the "Alapon Editorial" account belong in this section.
update public.posts
   set category_slug = 'editorial'
 where author_id in (select id from public.profiles where username = 'alapon_editorial');
