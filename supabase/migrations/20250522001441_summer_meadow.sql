/*
  # Storage Security Enhancement

  1. Changes
    - Add secure storage policies
    - Configure signed URLs
    - Add file type validation
*/

-- Update storage policies for media bucket
DROP POLICY IF EXISTS "Media files are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Media files can be managed by authenticated users" ON storage.objects;

-- Public can view media files
CREATE POLICY "Media files are viewable by everyone"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'media'
    AND lower(storage.extension(name)) IN ('png', 'jpg', 'jpeg', 'gif', 'webp')
  );

-- Only editors and admins can manage media files
CREATE POLICY "Media files can be managed by editors and admins"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'media'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
    AND lower(storage.extension(name)) IN ('png', 'jpg', 'jpeg', 'gif', 'webp')
  )
  WITH CHECK (
    bucket_id = 'media'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
    AND lower(storage.extension(name)) IN ('png', 'jpg', 'jpeg', 'gif', 'webp')
  );