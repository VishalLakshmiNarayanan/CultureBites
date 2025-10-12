-- Add user_email column to hosts and cooks tables to link profiles to logged-in users

-- Add user_email to hosts table
ALTER TABLE hosts ADD COLUMN IF NOT EXISTS user_email text;

-- Add user_email to cooks table  
ALTER TABLE cooks ADD COLUMN IF NOT EXISTS user_email text;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_hosts_user_email ON hosts(user_email);
CREATE INDEX IF NOT EXISTS idx_cooks_user_email ON cooks(user_email);
