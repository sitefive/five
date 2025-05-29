/*
  # Analytics and Event Tracking Implementation

  1. New Tables
    - `post_events` for tracking user interactions
    - `post_analytics` for aggregated analytics data
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Add functions for event tracking
*/

-- Create post_events table
CREATE TABLE IF NOT EXISTS post_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  session_id text,
  ip_address text,
  lang text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on post_events
ALTER TABLE post_events ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view events
CREATE POLICY "Events are viewable by admins"
  ON post_events
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND active = true
  ));

-- Create post_analytics table for aggregated data
CREATE TABLE IF NOT EXISTS post_analytics (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  lang text NOT NULL,
  view_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  reaction_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  last_viewed_at timestamptz,
  PRIMARY KEY (post_id, lang)
);

-- Enable RLS on post_analytics
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can view analytics
CREATE POLICY "Analytics are viewable by everyone"
  ON post_analytics
  FOR SELECT
  TO public
  USING (true);

-- Function to track post event
CREATE OR REPLACE FUNCTION track_post_event(
  post_id_param uuid,
  event_type_param text,
  metadata_param jsonb DEFAULT '{}'::jsonb,
  session_id_param text DEFAULT NULL,
  lang_param text DEFAULT 'pt'
)
RETURNS void AS $$
BEGIN
  -- Insert event
  INSERT INTO post_events (
    post_id,
    event_type,
    metadata,
    session_id,
    ip_address,
    lang
  ) VALUES (
    post_id_param,
    event_type_param,
    metadata_param,
    session_id_param,
    request.header('x-forwarded-for'),
    lang_param
  );

  -- Update analytics based on event type
  IF event_type_param = 'view' THEN
    INSERT INTO post_analytics (post_id, lang, view_count, last_viewed_at)
    VALUES (post_id_param, lang_param, 1, now())
    ON CONFLICT (post_id, lang)
    DO UPDATE SET
      view_count = post_analytics.view_count + 1,
      last_viewed_at = now();
  ELSIF event_type_param = 'share' THEN
    INSERT INTO post_analytics (post_id, lang, share_count)
    VALUES (post_id_param, lang_param, 1)
    ON CONFLICT (post_id, lang)
    DO UPDATE SET
      share_count = post_analytics.share_count + 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get post analytics
CREATE OR REPLACE FUNCTION get_post_analytics(
  post_ids uuid[],
  lang_param text DEFAULT 'pt'
)
RETURNS TABLE (
  post_id uuid,
  view_count integer,
  share_count integer,
  reaction_count integer,
  comment_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pa.post_id,
    COALESCE(pa.view_count, 0) as view_count,
    COALESCE(pa.share_count, 0) as share_count,
    COALESCE((
      SELECT COUNT(*)::integer
      FROM post_reactions pr
      WHERE pr.post_id = pa.post_id
    ), 0) as reaction_count,
    COALESCE((
      SELECT COUNT(*)::integer
      FROM comments c
      WHERE c.post_id = pa.post_id
      AND c.status = 'approved'
    ), 0) as comment_count
  FROM unnest(post_ids) pid
  LEFT JOIN post_analytics pa ON pa.post_id = pid AND pa.lang = lang_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;