-- Catalog items
create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  price_label text,
  unit text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.catalog_items enable row level security;

-- Public read access
create policy "catalog_items_public_read" on public.catalog_items
  for select using (true);

-- Admin insert/update/delete
create policy "catalog_items_admin_insert" on public.catalog_items
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "catalog_items_admin_update" on public.catalog_items
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "catalog_items_admin_delete" on public.catalog_items
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
