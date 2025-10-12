-- Disable Row Level Security for custom authentication
-- Since we're using custom database authentication instead of Supabase Auth,
-- we need to disable RLS policies that check for auth.uid()

-- Disable RLS on hosts table
ALTER TABLE hosts DISABLE ROW LEVEL SECURITY;

-- Disable RLS on cooks table
ALTER TABLE cooks DISABLE ROW LEVEL SECURITY;

-- Disable RLS on events table
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Disable RLS on collaboration_requests table
ALTER TABLE collaboration_requests DISABLE ROW LEVEL SECURITY;

-- Disable RLS on seat_requests table
ALTER TABLE seat_requests DISABLE ROW LEVEL SECURITY;

-- Note: If you want to re-enable RLS later with custom policies,
-- you can create policies that check against the app_users table
-- instead of auth.users
