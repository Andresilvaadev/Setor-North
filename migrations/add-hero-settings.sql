create table if not exists public.site_settings (
  id           int primary key default 1 check (id = 1),
  hero_images  text[] not null default '{}',   -- fotos do topo do site (o site usa as 2 primeiras)
  updated_at   timestamptz not null default now()
);

-- Garante a linha única
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- RLS: leitura pública, escrita só admin
alter table public.site_settings enable row level security;

create policy "public read site_settings"
  on public.site_settings for select using (true);

create policy "admin write site_settings"
  on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());
