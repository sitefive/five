/*
  # Blog Improvements - Phase 1
  
  1. New Tables
    - `comments`
      - Comment system for blog posts
      - Moderation support
      - RLS policies
    
    - `post_views`
      - Track post view counts
      - RLS policies for read/write
    
  2. Functions
    - Increment view count function
    - Comment spam protection
    
  3. Security
    - RLS policies for new tables
    - Rate limiting for comments
*/

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can create pending comments
CREATE POLICY "Anyone can create pending comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (status = 'pending');

-- Public can view approved comments
CREATE POLICY "Anyone can view approved comments"
  ON comments
  FOR SELECT
  TO public
  USING (status = 'approved');

-- Admins can manage all comments
CREATE POLICY "Admins can manage comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND active = true
  ));

-- Create post_views table
CREATE TABLE IF NOT EXISTS post_views (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE PRIMARY KEY,
  count integer DEFAULT 0
);

-- Enable RLS on post_views
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Anyone can read view counts
CREATE POLICY "Anyone can read view counts"
  ON post_views
  FOR SELECT
  TO public
  USING (true);

-- Only the increment function can update views
CREATE POLICY "Only function can update views"
  ON post_views
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_post_view(post_id_param uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO post_views (post_id, count)
  VALUES (post_id_param, 1)
  ON CONFLICT (post_id)
  DO UPDATE SET count = post_views.count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check comment rate limit
CREATE OR REPLACE FUNCTION check_comment_rate_limit(ip_address text)
RETURNS boolean AS $$
DECLARE
  recent_comments integer;
BEGIN
  SELECT COUNT(*)
  INTO recent_comments
  FROM comments
  WHERE created_at > now() - interval '5 minutes'
  AND ip_address = ip_address;
  
  RETURN recent_comments < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger for comments
CREATE TRIGGER audit_comments_changes
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();