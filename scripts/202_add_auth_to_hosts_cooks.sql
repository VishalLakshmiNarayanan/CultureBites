-- Add user_id and email columns to hosts and cooks tables
ALTER TABLE public.hosts
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE public.cooks
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS email text;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_hosts_user_id ON public.hosts(user_id);
CREATE INDEX IF NOT EXISTS idx_cooks_user_id ON public.cooks(user_id);

-- Update RLS policies to use auth.uid()
DROP POLICY IF EXISTS "anon read hosts" ON public.hosts;
DROP POLICY IF EXISTS "anon insert hosts" ON public.hosts;
DROP POLICY IF EXISTS "anon update hosts" ON public.hosts;

DROP POLICY IF EXISTS "anon read cooks" ON public.cooks;
DROP POLICY IF EXISTS "anon insert cooks" ON public.cooks;
DROP POLICY IF EXISTS "anon update cooks" ON public.cooks;

-- New RLS policies for authenticated users
CREATE POLICY "users can view all hosts" ON public.hosts FOR SELECT USING (true);
CREATE POLICY "users can insert their own host profile" ON public.hosts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update their own host profile" ON public.hosts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users can delete their own host profile" ON public.hosts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "users can view all cooks" ON public.cooks FOR SELECT USING (true);
CREATE POLICY "users can insert their own cook profile" ON public.cooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update their own cook profile" ON public.cooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users can delete their own cook profile" ON public.cooks FOR DELETE USING (auth.uid() = user_id);

-- Update profiles table to store user role
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_role text CHECK (user_role IN ('host', 'cook', 'guest'));

-- Create a function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, user_role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'user_role', 'guest')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Create trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
