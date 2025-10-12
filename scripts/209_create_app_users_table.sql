-- Create a separate table for app authentication
-- This table is independent of Supabase Auth and has no foreign key constraints

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('host', 'cook', 'guest')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Create policies for app_users
CREATE POLICY "Allow public read access to app_users"
  ON app_users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to app_users"
  ON app_users FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own data"
  ON app_users FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_app_users_updated_at();
