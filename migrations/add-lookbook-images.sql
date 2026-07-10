-- Adiciona coluna lookbook_images na tabela site_settings (já existente)
alter table public.site_settings
  add column if not exists lookbook_images text[] not null default '{}';
