create extension if not exists "pgcrypto";

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('desi', 'bbq', 'buffet', 'fastfood', 'beverages')),
  price numeric(10, 2) not null,
  rating numeric(2, 1) default 0,
  image_url text,
  is_available boolean not null default true
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone_number text not null,
  guests_count integer not null check (guests_count > 0),
  reservation_date date not null,
  reservation_time time not null,
  special_request text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;
alter table public.reservations enable row level security;

create policy "Public can view available menu items" on public.menu_items for select using (is_available = true);
create policy "Public can create reservations" on public.reservations for insert with check (true);

insert into public.menu_items (name, category, price, rating, image_url) values
('Mutton Karahi', 'desi', 1850, 4.9, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85'),
('Kinara BBQ Platter', 'bbq', 2450, 4.8, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85'),
('Chicken Biryani', 'desi', 650, 4.7, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85'),
('Smoky Beef Burger', 'fastfood', 790, 4.6, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85'),
('Family Hi-Tea', 'buffet', 1299, 4.8, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85'),
('Malai Tikka', 'bbq', 1250, 4.9, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85')
 on conflict do nothing;
