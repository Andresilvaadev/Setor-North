-- ============================================================================
--  MIGRAÇÃO: descrição completa do produto (página de detalhes)
--  Rode isto UMA VEZ no SQL Editor do Supabase.
-- ============================================================================

alter table public.products
  add column if not exists description text not null default '';
