-- Add password column to profiles table for simple authentication
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password TEXT;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update existing users to have a password based on their display name
-- This allows existing users to log in with their name as password
UPDATE profiles 
SET password = COALESCE(display_name, 'password123')
WHERE password IS NULL OR password = '';
