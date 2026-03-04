-- Gallery media
create table if not exists public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_url text not null,
  media_type text not null default 'video' check (media_type in ('video', 'image')),
  thumbnail_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_media enable row level security;

-- Public read access
create policy "gallery_public_read" on public.gallery_media
  for select using (true);

-- Admin insert/update/delete
create policy "gallery_admin_insert" on public.gallery_media
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "gallery_admin_update" on public.gallery_media
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "gallery_admin_delete" on public.gallery_media
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
