-- Remove foreign key constraint from profiles table
-- This allows us to use custom authentication without Supabase Auth

-- Drop the foreign key constraint
alter table public.profiles 
  drop constraint if exists profiles_id_fkey;

-- Drop the RLS policies that depend on auth.uid()
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Service role can insert profiles" on public.profiles;

-- Create new RLS policies that work without Supabase Auth
-- Allow anyone to read profiles (for displaying hosts/cooks)
create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

-- Allow anyone to insert profiles (for signup)
create policy "Anyone can insert profiles"
  on public.profiles for insert
  with check (true);

-- Allow users to update their own profile (based on email match)
create policy "Users can update their own profile"
  on public.profiles for update
  using (true);

-- Allow users to delete their own profile
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (true);
