-- Drop all existing tables
DROP TABLE IF EXISTS public.seat_requests CASCADE;
DROP TABLE IF EXISTS public.collaboration_requests CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.cooks CASCADE;
DROP TABLE IF EXISTS public.hosts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('user', 'host', 'cook')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE public.hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  space_type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create cooks table
CREATE TABLE public.cooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  story TEXT NOT NULL,
  profile_picture TEXT,
  cuisine_images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  host_id UUID NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
  cook_id UUID REFERENCES public.cooks(id) ON DELETE SET NULL,
  date_iso TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  seats_total INTEGER NOT NULL,
  seats_left INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create collaboration_requests table
CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cook_id UUID NOT NULL REFERENCES public.cooks(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at_iso TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create seat_requests table
CREATE TABLE public.seat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  seats_requested INTEGER NOT NULL,
  dietary_restrictions TEXT,
  created_at_iso TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own user" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for hosts table
CREATE POLICY "Anyone can read hosts" ON public.hosts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert hosts" ON public.hosts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Host owners can update their hosts" ON public.hosts FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth.uid() = id)
);

-- RLS Policies for cooks table
CREATE POLICY "Anyone can read cooks" ON public.cooks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert cooks" ON public.cooks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Cook owners can update their cooks" ON public.cooks FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth.uid() = id)
);

-- RLS Policies for events table
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Host owners can insert events" ON public.events FOR INSERT WITH CHECK (
  host_id IN (SELECT id FROM public.hosts WHERE user_id IN (SELECT id FROM public.users WHERE auth.uid() = id))
);
CREATE POLICY "Host owners can update their events" ON public.events FOR UPDATE USING (
  host_id IN (SELECT id FROM public.hosts WHERE user_id IN (SELECT id FROM public.users WHERE auth.uid() = id))
);

-- RLS Policies for collaboration_requests table
CREATE POLICY "Anyone can read collaboration requests" ON public.collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Cooks can insert collaboration requests" ON public.collaboration_requests FOR INSERT WITH CHECK (
  cook_id IN (SELECT id FROM public.cooks WHERE user_id IN (SELECT id FROM public.users WHERE auth.uid() = id))
);
CREATE POLICY "Hosts can update collaboration requests for their events" ON public.collaboration_requests FOR UPDATE USING (
  host_id IN (SELECT id FROM public.hosts WHERE user_id IN (SELECT id FROM public.users WHERE auth.uid() = id))
);

-- RLS Policies for seat_requests table
CREATE POLICY "Anyone can read seat requests" ON public.seat_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert seat requests" ON public.seat_requests FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_hosts_user_id ON public.hosts(user_id);
CREATE INDEX idx_cooks_user_id ON public.cooks(user_id);
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_cook_id ON public.events(cook_id);
CREATE INDEX idx_events_date ON public.events(date_iso);
CREATE INDEX idx_collab_event_id ON public.collaboration_requests(event_id);
CREATE INDEX idx_collab_cook_id ON public.collaboration_requests(cook_id);
CREATE INDEX idx_collab_host_id ON public.collaboration_requests(host_id);
CREATE INDEX idx_seat_event_id ON public.seat_requests(event_id);
CREATE INDEX idx_seat_user_id ON public.seat_requests(user_id);

-- Create function to automatically create user record after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
