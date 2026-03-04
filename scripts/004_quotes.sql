-- Quotes
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text,
  event_date date,
  guest_count int,
  venue text,
  status text not null default 'draft' check (status in ('draft', 'pending', 'approved', 'rejected')),
  total numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

-- Users see own quotes
create policy "quotes_select_own" on public.quotes
  for select using (auth.uid() = user_id);

-- Users insert own quotes
create policy "quotes_insert_own" on public.quotes
  for insert with check (auth.uid() = user_id);

-- Users update own draft quotes
create policy "quotes_update_own" on public.quotes
  for update using (auth.uid() = user_id and status = 'draft');

-- Admins see all quotes
create policy "quotes_admin_select" on public.quotes
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins update all quotes
create policy "quotes_admin_update" on public.quotes
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Quote line items
create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  name text not null,
  price numeric(10, 2) not null default 0,
  quantity int not null default 1,
  unit text,
  created_at timestamptz not null default now()
);

alter table public.quote_items enable row level security;

-- Users see own quote items (via quote ownership)
create policy "quote_items_select_own" on public.quote_items
  for select using (
    exists (select 1 from public.quotes where id = quote_id and user_id = auth.uid())
  );

-- Users insert quote items for own quotes
create policy "quote_items_insert_own" on public.quote_items
  for insert with check (
    exists (select 1 from public.quotes where id = quote_id and user_id = auth.uid())
  );

-- Admins see all quote items
create policy "quote_items_admin_select" on public.quote_items
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
