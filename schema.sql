-- ============================================================================
--  SETOR NORTE — SCHEMA SUPABASE
--  Cole tudo isto no SQL Editor do Supabase e clique em RUN.
--  Cria: categories, products, drop_settings, admins + RLS + bucket de imagens.
-- ============================================================================

-- Extensão para gerar UUIDs (já vem no Supabase, mas garantimos)
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- TABELA: categories
-- (NÃO inclua 'Todos' aqui — o site adiciona o "Todos" sozinho no filtro)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TABELA: products  (catálogo e drop no mesmo lugar, separados por is_drop)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  sku         text not null unique,                 -- ex.: SN-CAM-001 (vai no WhatsApp)
  name        text not null,
  category    text not null,                        -- bate com categories.name
  color       text default '',
  price       numeric(10,2),                        -- null = "sob consulta"
  promo_price numeric(10,2),                         -- preço de promoção (null = sem promoção)
  description text not null default '',              -- descrição completa (página do produto)
  sizes       text[] not null default '{}',         -- ex.: {P,M,G,GG}
  image       text default '',                      -- capa (1ª foto) — compatibilidade
  images      text[] not null default '{}',         -- todas as fotos do produto (galeria)
  status      text not null default 'disponivel'
              check (status in ('disponivel','esgotado')),
  featured    boolean not null default false,
  is_drop     boolean not null default false,       -- true = peça do Drop
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists products_is_drop_idx on public.products (is_drop);
create index if not exists products_category_idx on public.products (category);

-- ---------------------------------------------------------------------------
-- TABELA: drop_settings  (linha única, id sempre = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.drop_settings (
  id            int primary key default 1 check (id = 1),
  status        text not null default 'inactive'
                check (status in ('inactive','comingSoon','live','ended')),
  name          text not null default 'DROP 01',
  tagline       text not null default 'Coleção limitada. Quando acabar, acabou.',
  release_date  timestamptz,
  updated_at    timestamptz not null default now()
);

insert into public.drop_settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- TABELA: site_settings  (linha única, id sempre = 1) — fotos do hero etc.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id           int primary key default 1 check (id = 1),
  hero_images  text[] not null default '{}',   -- fotos do topo do site (usa as 2 primeiras)
  updated_at   timestamptz not null default now()
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- TABELA: admins  (allowlist — só estes usuários podem escrever)
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

-- Função helper: o usuário logado é admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- ============================================================================
--  RLS  (leitura pública, escrita só admin)
-- ============================================================================
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.drop_settings  enable row level security;
alter table public.site_settings  enable row level security;
alter table public.admins         enable row level security;

-- Leitura pública
create policy "public read categories"
  on public.categories for select using (true);
create policy "public read products"
  on public.products for select using (true);
create policy "public read drop_settings"
  on public.drop_settings for select using (true);
create policy "public read site_settings"
  on public.site_settings for select using (true);

-- Escrita só admin — categories
create policy "admin write categories"
  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- Escrita só admin — products
create policy "admin write products"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- Escrita só admin — drop_settings (update apenas; linha única já existe)
create policy "admin write drop_settings"
  on public.drop_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- Escrita só admin — site_settings
create policy "admin write site_settings"
  on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- admins: cada admin enxerga a tabela; gerência feita pelo dashboard/service role
create policy "admin read admins"
  on public.admins for select using (public.is_admin());

-- ============================================================================
--  STORAGE  (bucket público de imagens dos produtos)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Leitura pública das imagens
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Upload/edição/remoção só admin
create policy "admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================================
--  SEED opcional — produtos atuais do site (rode se quiser já popular)
-- ============================================================================
insert into public.categories (name, sort_order) values
  ('Camisetas', 1), ('Oversized', 2), ('Moletons', 3), ('Ecobags', 4)
on conflict (name) do nothing;

insert into public.products (sku, name, category, color, price, sizes, image, status, featured, is_drop, sort_order) values
  ('SN-CAM-001','Camiseta Oversized Preta','Oversized','Preto',89.90,'{P,M,G,GG}','',  'disponivel', true,  false, 1),
  ('SN-CAM-002','Camiseta Gangster','Camisetas','Preto',79.90,'{P,M,G,GG}','',          'disponivel', false, false, 2),
  ('SN-CAM-003','Camiseta Chronic Branca','Camisetas','Branco',79.90,'{P,M,G}','',       'disponivel', false, false, 3),
  ('SN-CAM-004','Camiseta Evangelion','Camisetas','Preto',84.90,'{M,G,GG}','',           'esgotado',   false, false, 4),
  ('SN-MOL-001','Moletom Capuz Verde','Moletons','Verde',169.90,'{M,G,GG}','',           'disponivel', true,  false, 5),
  ('SN-ECO-001','Ecobag Evangelion','Ecobags','Off-white',39.90,'{Único}','',            'disponivel', false, false, 6),
  ('SN-ECO-002','Ecobag Setor North','Ecobags','Off-white',39.90,'{Único}','',           'disponivel', false, false, 7),
  ('SN-CAM-005','Camiseta Oversized Branca','Oversized','Branco',89.90,'{P,M,G,GG}','',  'disponivel', false, false, 8),
  ('SN-DROP-001','Camiseta Drop 01','Camisetas','Preto',119.90,'{P,M,G,GG}','',          'disponivel', false, true,  1)
on conflict (sku) do nothing;

-- ============================================================================
--  DEPOIS DE CRIAR SEU USUÁRIO (Authentication > Users > Add user),
--  rode isto trocando pelo seu e-mail para virar admin:
--
--  insert into public.admins (user_id, email)
--  select id, email from auth.users where email = 'SEU-EMAIL@exemplo.com'
--  on conflict (user_id) do nothing;
-- ============================================================================
