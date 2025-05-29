/*
  # Add Tag Management Support

  1. Changes
    - Add RLS policies for tags table
    - Add policies for tag management
    
  2. Security
    - Enable RLS on tags table
    - Add policies for authenticated users
*/

-- Enable RLS on tags table
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Add policies for tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Tags can be managed by authenticated users"
  ON tags
  USING (auth.role() = 'authenticated');

-- Add index for tag names in each language
CREATE INDEX idx_tags_name_pt ON tags (name_pt);
CREATE INDEX idx_tags_name_en ON tags (name_en);
CREATE INDEX idx_tags_name_es ON tags (name_es);