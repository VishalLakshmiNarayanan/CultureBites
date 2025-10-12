-- Add default UUID generation to profiles table id column
ALTER TABLE profiles 
ALTER COLUMN id SET DEFAULT gen_random_uuid();
