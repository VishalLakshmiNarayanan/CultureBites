-- Drop existing tables if they exist
drop table if exists public.seat_requests cascade;
drop table if exists public.collaboration_requests cascade;
drop table if exists public.events cascade;
drop table if exists public.cooks cascade;
drop table if exists public.hosts cascade;

-- Create hosts table
create table public.hosts (
  id text primary key,
  name text not null,
  location text not null,
  space_type text not null,
  capacity integer not null,
  amenities text[] not null default '{}',
  description text not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Create cooks table
create table public.cooks (
  id text primary key,
  name text not null,
  origin_country text not null,
  specialties text[] not null default '{}',
  story text not null,
  profile_picture text,
  cuisine_images text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Create events table
create table public.events (
  id text primary key,
  title text not null,
  cuisine text not null,
  host_id text not null references public.hosts(id) on delete cascade,
  cook_id text,
  date_iso text not null,
  start_time text not null,
  end_time text not null,
  location text not null,
  images text[] not null default '{}',
  seats_total integer not null,
  seats_left integer not null,
  created_at timestamptz not null default now()
);

-- Create collaboration_requests table
create table public.collaboration_requests (
  id text primary key,
  cook_id text not null references public.cooks(id) on delete cascade,
  event_id text not null references public.events(id) on delete cascade,
  host_id text not null references public.hosts(id) on delete cascade,
  message text not null,
  status text not null default 'pending',
  created_at_iso text not null,
  created_at timestamptz not null default now()
);

-- Create seat_requests table
create table public.seat_requests (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  guest_name text not null,
  guest_email text not null,
  seats_requested integer not null,
  dietary_restrictions text,
  created_at_iso text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.hosts enable row level security;
alter table public.cooks enable row level security;
alter table public.events enable row level security;
alter table public.collaboration_requests enable row level security;
alter table public.seat_requests enable row level security;

-- Create policies for anonymous access (prototype only - use auth.uid() in production)
create policy "anon read hosts" on public.hosts for select using (true);
create policy "anon insert hosts" on public.hosts for insert with check (true);
create policy "anon update hosts" on public.hosts for update using (true);

create policy "anon read cooks" on public.cooks for select using (true);
create policy "anon insert cooks" on public.cooks for insert with check (true);
create policy "anon update cooks" on public.cooks for update using (true);

create policy "anon read events" on public.events for select using (true);
create policy "anon insert events" on public.events for insert with check (true);
create policy "anon update events" on public.events for update using (true);

create policy "anon read collabs" on public.collaboration_requests for select using (true);
create policy "anon insert collabs" on public.collaboration_requests for insert with check (true);
create policy "anon update collabs" on public.collaboration_requests for update using (true);

create policy "anon read seats" on public.seat_requests for select using (true);
create policy "anon insert seats" on public.seat_requests for insert with check (true);

-- Create indexes for better query performance
create index idx_events_host_id on public.events(host_id);
create index idx_events_date on public.events(date_iso);
create index idx_collab_event_id on public.collaboration_requests(event_id);
create index idx_collab_cook_id on public.collaboration_requests(cook_id);
create index idx_seat_event_id on public.seat_requests(event_id);
