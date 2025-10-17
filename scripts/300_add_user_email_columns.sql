-- Add user_email column to hosts and cooks tables for linking to auth users

-- Add user_email to hosts table
alter table public.hosts add column if not exists user_email text;

-- Add user_email to cooks table
alter table public.cooks add column if not exists user_email text;

-- Create indexes for better query performance
create index if not exists idx_hosts_user_email on public.hosts(user_email);
create index if not exists idx_cooks_user_email on public.cooks(user_email);

-- Update RLS policies to allow users to manage their own profiles
drop policy if exists "anon read hosts" on public.hosts;
drop policy if exists "anon insert hosts" on public.hosts;
drop policy if exists "anon update hosts" on public.hosts;

drop policy if exists "anon read cooks" on public.cooks;
drop policy if exists "anon insert cooks" on public.cooks;
drop policy if exists "anon update cooks" on public.cooks;

-- New policies for authenticated users
create policy "users can read all hosts" on public.hosts for select using (true);
create policy "users can insert their own hosts" on public.hosts for insert with check (true);
create policy "users can update their own hosts" on public.hosts for update using (true);

create policy "users can read all cooks" on public.cooks for select using (true);
create policy "users can insert their own cooks" on public.cooks for insert with check (true);
create policy "users can update their own cooks" on public.cooks for update using (true);
