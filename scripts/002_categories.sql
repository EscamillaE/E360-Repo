-- Catalog categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Public read access
create policy "categories_public_read" on public.categories
  for select using (true);

-- Admin insert/update/delete
create policy "categories_admin_insert" on public.categories
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "categories_admin_update" on public.categories
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "categories_admin_delete" on public.categories
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
