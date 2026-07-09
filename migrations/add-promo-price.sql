alter table public.products
  add column if not exists promo_price numeric(10,2);
