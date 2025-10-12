-- Drop the trigger that's causing signup failures
-- This trigger was automatically creating profiles but failing during signup

-- Drop the trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Drop the function if it exists
drop function if exists public.handle_new_user();

-- Note: Profiles will now be created manually in the application code after signup
-- This prevents signup failures due to trigger errors
