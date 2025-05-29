-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Enable RLS on storage bucket
CREATE POLICY "Media files are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Only authenticated users can insert/update/delete media files
CREATE POLICY "Media files can be managed by authenticated users"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');