-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  name text not null,
  event_date date,
  venue text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Users see own events
create policy "events_select_own" on public.events
  for select using (auth.uid() = user_id);

-- Users insert own events
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id);

-- Users update own events
create policy "events_update_own" on public.events
  for update using (auth.uid() = user_id);

-- Admins see all events
create policy "events_admin_select" on public.events
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins update all events
create policy "events_admin_update" on public.events
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
