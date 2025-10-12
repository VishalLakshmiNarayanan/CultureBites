-- Create storage buckets for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('event-images', 'event-images', true),
  ('space-photos', 'space-photos', true),
  ('portfolio-photos', 'portfolio-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "avatars_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for event images
CREATE POLICY "event_images_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "event_images_insert_authenticated" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "event_images_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "event_images_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for space photos
CREATE POLICY "space_photos_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'space-photos');

CREATE POLICY "space_photos_insert_host" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'space-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "space_photos_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'space-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "space_photos_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'space-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for portfolio photos
CREATE POLICY "portfolio_photos_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-photos');

CREATE POLICY "portfolio_photos_insert_cook" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "portfolio_photos_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "portfolio_photos_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
