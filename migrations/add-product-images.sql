alter table public.products
  add column if not exists images text[] not null default '{}';

  -- 2) Migra a foto única que já existe para dentro da galeria
  update public.products
     set images = array[image]
      where image is not null
         and image <> ''
            and coalesce(array_length(images, 1), 0) = 0;
