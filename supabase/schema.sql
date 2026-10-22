-- Run in Supabase SQL editor (or `supabase db push`), then run seed.sql.

create extension if not exists "pgcrypto";

create type gender_type  as enum ('men', 'women', 'unisex');
create type order_status as enum ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- Categories ---------------------------------------------------------------
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  created_at timestamptz not null default now()
);

-- Products -----------------------------------------------------------------
create table public.products (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.categories(id) on delete restrict,
  slug         text not null unique,
  name         text not null,
  description  text not null default '',
  price_cents  integer not null check (price_cents >= 0),
  gender       gender_type not null default 'unisex',
  images       text[] not null default '{}',                 -- storage URLs, first = primary
  colors       jsonb  not null default '[]'::jsonb,          -- [{"name":"Black","hex":"#111111"}]
  sizes        text[] not null default '{}',                 -- {"S","M","L"}
  is_featured  boolean not null default false,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
create index products_category_idx on public.products (category_id);
create index products_gender_idx   on public.products (gender);
create index products_created_idx  on public.products (created_at desc);
create index products_featured_idx on public.products (is_featured) where is_featured;

-- Profiles (1:1 with auth.users) ---------------------------------------------
create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  phone            text,
  default_shipping jsonb,
  created_at       timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Orders ---------------------------------------------------------------------
create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete set null, -- null = guest
  email            text not null,
  full_name        text not null,
  shipping_address jsonb not null,
  status           order_status not null default 'pending',
  subtotal_cents   integer not null default 0 check (subtotal_cents >= 0),
  created_at       timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id);

create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  product_name     text not null,                       -- snapshot
  unit_price_cents integer not null check (unit_price_cents >= 0), -- snapshot
  quantity         integer not null check (quantity > 0),
  color            text,
  size             text
);
create index order_items_order_idx on public.order_items (order_id);

-- Row Level Security ---------------------------------------------------------
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "categories are public" on public.categories for select using (true);
create policy "active products are public" on public.products for select using (is_active);

create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own orders read" on public.orders for select using (auth.uid() = user_id);
create policy "own order items read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Order placement ------------------------------------------------------------
-- Prices are read from the products table server-side, so clients can't tamper with them.
create function public.create_order(
  p_email text, p_full_name text, p_shipping jsonb, p_items jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_order_id uuid;
  v_subtotal integer;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  insert into orders (user_id, email, full_name, shipping_address)
  values (auth.uid(), p_email, p_full_name, p_shipping)
  returning id into v_order_id;

  insert into order_items (order_id, product_id, product_name, unit_price_cents, quantity, color, size)
  select v_order_id, p.id, p.name, p.price_cents, greatest(1, least(i.quantity, 20)), i.color, nullif(i.size, '')
  from jsonb_to_recordset(p_items) as i(product_id uuid, quantity int, color text, size text)
  join products p on p.id = i.product_id and p.is_active;

  select coalesce(sum(unit_price_cents * quantity), 0) into v_subtotal
  from order_items where order_id = v_order_id;

  if v_subtotal = 0 then
    raise exception 'No valid items in cart';
  end if;

  update orders set subtotal_cents = v_subtotal where id = v_order_id;
  return v_order_id;
end $$;

grant execute on function public.create_order(text, text, jsonb, jsonb) to anon, authenticated;

-- Storage: create a public bucket named "products" in the dashboard, or:
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
