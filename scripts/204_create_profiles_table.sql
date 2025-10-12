-- Create profiles table for user authentication
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  user_role text check (user_role in ('host', 'cook', 'guest')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow service role to insert profiles (for application-level profile creation)
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- Removed automatic trigger to prevent signup failures
-- Profile creation will be handled in application code after successful signup
-- This ensures user signup succeeds even if profile creation has issues

-- Create index for better query performance
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(user_role);
