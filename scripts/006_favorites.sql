-- Favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, catalog_item_id)
);

alter table public.favorites enable row level security;

-- Users manage own favorites
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);
