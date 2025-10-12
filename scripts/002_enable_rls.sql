-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Events RLS Policies
CREATE POLICY "events_select_all" ON events
  FOR SELECT USING (true);

CREATE POLICY "events_insert_host" ON events
  FOR INSERT WITH CHECK (
    auth.uid() = host_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'host')
  );

CREATE POLICY "events_update_host_or_cook" ON events
  FOR UPDATE USING (
    auth.uid() = host_id OR auth.uid() = cook_id
  );

CREATE POLICY "events_delete_host" ON events
  FOR DELETE USING (auth.uid() = host_id);

-- Contacts RLS Policies
CREATE POLICY "contacts_select_involved" ON contacts
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

CREATE POLICY "contacts_insert_own" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "contacts_update_recipient" ON contacts
  FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "contacts_delete_own" ON contacts
  FOR DELETE USING (auth.uid() = sender_id);

-- Bookings RLS Policies
CREATE POLICY "bookings_select_own_or_host" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM events WHERE events.id = bookings.event_id AND events.host_id = auth.uid())
  );

CREATE POLICY "bookings_insert_own" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_update_own" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "bookings_delete_own" ON bookings
  FOR DELETE USING (auth.uid() = user_id);
