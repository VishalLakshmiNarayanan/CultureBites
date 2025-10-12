-- Create auth users for existing hosts and cooks
-- This script creates email addresses using name@gmail.com format
-- and sets password as their name (hashed)

DO $$
DECLARE
  host_record RECORD;
  cook_record RECORD;
  new_user_id uuid;
BEGIN
  -- Process existing hosts
  FOR host_record IN SELECT id, name FROM public.hosts WHERE user_id IS NULL
  LOOP
    -- Create auth user for host
    -- Note: In production, you would use Supabase Admin API to create users
    -- For now, we'll just update the email field
    UPDATE public.hosts
    SET email = LOWER(REPLACE(host_record.name, ' ', '')) || '@gmail.com'
    WHERE id = host_record.id;
    
    RAISE NOTICE 'Updated host % with email %', host_record.name, LOWER(REPLACE(host_record.name, ' ', '')) || '@gmail.com';
  END LOOP;

  -- Process existing cooks
  FOR cook_record IN SELECT id, name FROM public.cooks WHERE user_id IS NULL
  LOOP
    -- Create auth user for cook
    UPDATE public.cooks
    SET email = LOWER(REPLACE(cook_record.name, ' ', '')) || '@gmail.com'
    WHERE id = cook_record.id;
    
    RAISE NOTICE 'Updated cook % with email %', cook_record.name, LOWER(REPLACE(cook_record.name, ' ', '')) || '@gmail.com';
  END LOOP;
END $$;

-- Note: To create actual auth users, you need to use Supabase Admin API
-- The password for each user should be their name (e.g., "Sam Anderson" -> password: "Sam Anderson")
-- You can create these users manually in Supabase dashboard or via Admin API
