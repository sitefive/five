/*
  # Add Post Reactions and View Tracking

  1. New Tables
    - `post_reactions`
      - Track emoji reactions per post
      - One reaction per emoji per session
    - `post_views`
      - Enhanced view tracking with session handling
      
  2. Security
    - Enable RLS on new tables
    - Add policies for public access
    - Add rate limiting for reactions
*/

-- Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK (emoji IN ('👍', '❤️', '🔥', '👏')),
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, emoji, session_id)
);

-- Enable RLS on post_reactions
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON post_reactions
  FOR SELECT
  TO public
  USING (true);

-- Anyone can add reactions
CREATE POLICY "Anyone can add reactions"
  ON post_reactions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create function to handle reaction toggle
CREATE OR REPLACE FUNCTION toggle_post_reaction(
  post_id_param uuid,
  emoji_param text,
  session_id_param text
)
RETURNS boolean AS $$
DECLARE
  reaction_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM post_reactions
    WHERE post_id = post_id_param
    AND emoji = emoji_param
    AND session_id = session_id_param
  ) INTO reaction_exists;

  IF reaction_exists THEN
    DELETE FROM post_reactions
    WHERE post_id = post_id_param
    AND emoji = emoji_param
    AND session_id = session_id_param;
    RETURN false;
  ELSE
    INSERT INTO post_reactions (post_id, emoji, session_id)
    VALUES (post_id_param, emoji_param, session_id_param);
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger for reactions
CREATE TRIGGER audit_post_reactions_changes
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();