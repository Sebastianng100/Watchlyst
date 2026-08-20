create extension if not exists pgcrypto;
create table public.watch_items (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 tmdb_id integer not null check (tmdb_id > 0), media_type text not null check (media_type in ('tv','movie')),
 title text not null check (char_length(title) between 1 and 300), poster_path text, overview text,
 release_year integer check (release_year between 1870 and 2200), status text not null default 'plan_to_watch',
 current_season integer check (current_season >= 0), current_episode integer check (current_episode >= 0),
 rating numeric(3,1) check (rating between 0 and 10), notes text check (char_length(notes) <= 10000),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique (user_id,tmdb_id,media_type),
 constraint valid_status check ((media_type='tv' and status in ('watching','plan_to_watch','completed','on_hold','dropped')) or (media_type='movie' and status in ('plan_to_watch','watched'))),
 constraint tv_progress_only check ((media_type='tv' and current_season is not null and current_episode is not null) or (media_type='movie' and current_season is null and current_episode is null))
);
create index watch_items_user_updated_idx on public.watch_items(user_id,updated_at desc);
create function public.set_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end; $$;
create trigger watch_items_set_updated_at before update on public.watch_items for each row execute function public.set_updated_at();
alter table public.watch_items enable row level security;
create policy "Users select own items" on public.watch_items for select to authenticated using ((select auth.uid())=user_id);
create policy "Users insert own items" on public.watch_items for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Users update own items" on public.watch_items for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Users delete own items" on public.watch_items for delete to authenticated using ((select auth.uid())=user_id);
revoke all on public.watch_items from anon; grant select,insert,update,delete on public.watch_items to authenticated;
