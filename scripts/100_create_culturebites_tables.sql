-- Create hosts table
CREATE TABLE IF NOT EXISTS public.hosts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image TEXT,
  space_title TEXT NOT NULL,
  space_desc TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cooks table
CREATE TABLE IF NOT EXISTS public.cooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image TEXT,
  origin_country TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  story TEXT NOT NULL,
  cuisine_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  host_id TEXT NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
  cook_id TEXT REFERENCES public.cooks(id) ON DELETE SET NULL,
  date_iso TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  seats_total INTEGER NOT NULL,
  seats_left INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collaboration_requests table
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id TEXT PRIMARY KEY,
  from_cook_id TEXT NOT NULL REFERENCES public.cooks(id) ON DELETE CASCADE,
  to_host_id TEXT NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_dishes TEXT[] DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at_iso TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seat_requests table
CREATE TABLE IF NOT EXISTS public.seat_requests (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'waitlist', 'declined')),
  created_at_iso TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_host_id ON public.events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_cook_id ON public.events(cook_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_cook_id ON public.collaboration_requests(from_cook_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_host_id ON public.collaboration_requests(to_host_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_event_id ON public.collaboration_requests(event_id);
CREATE INDEX IF NOT EXISTS idx_seat_requests_event_id ON public.seat_requests(event_id);
