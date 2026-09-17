create extension if not exists "pgcrypto";

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  type text not null check (type in ('text', 'image')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  image_url text not null default '',
  images text[] not null default '{}',
  category text not null default 'Portfolio',
  description text not null default '',
  client text,
  year integer,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_items
add column if not exists featured boolean not null default false;

alter table public.portfolio_items
add column if not exists images text[] not null default '{}',
add column if not exists category text not null default 'Portfolio',
add column if not exists description text not null default '',
add column if not exists client text;

alter table public.portfolio_items
drop column if exists project_date,
drop column if exists year;


alter table public.site_content enable row level security;
alter table public.portfolio_items enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
using (true);

drop policy if exists "Admin can manage site content" on public.site_content;
create policy "Admin can manage site content"
on public.site_content
for all
using (auth.jwt() ->> 'email' = 'rubexydesigns@gmail.com')
with check (auth.jwt() ->> 'email' = 'rubexydesigns@gmail.com');

drop policy if exists "Public can read portfolio items" on public.portfolio_items;
create policy "Public can read portfolio items"
on public.portfolio_items
for select
using (true);

drop policy if exists "Admin can manage portfolio items" on public.portfolio_items;
create policy "Admin can manage portfolio items"
on public.portfolio_items
for all
using (auth.jwt() ->> 'email' = 'rubexydesigns@gmail.com')
with check (auth.jwt() ->> 'email' = 'rubexydesigns@gmail.com');
