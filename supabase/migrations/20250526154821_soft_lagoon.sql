/*
  # Complete Schema Implementation with Security

  1. Tables
    - Proper foreign key relationships
    - Timestamps on all tables
    - Correct data types and constraints
    
  2. Security
    - RLS enabled on all tables
    - Role-based access control
    - Audit logging
    
  3. Analytics
    - View tracking
    - Engagement metrics
    - Anti-spam measures
*/

-- Drop existing tables to ensure clean slate
DROP TABLE IF EXISTS post_analytics CASCADE;
DROP TABLE IF EXISTS post_reactions CASCADE;
DROP TABLE IF EXISTS post_views CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'editor')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create authors table
CREATE TABLE authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar text,
  created_at timestamptz DEFAULT now(),
  name_pt text,
  name_en text,
  name_es text,
  bio_pt text,
  bio_en text,
  bio_es text
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name_pt text,
  name_en text,
  name_es text,
  slug_pt text UNIQUE,
  slug_en text UNIQUE,
  slug_es text UNIQUE,
  description_pt text,
  description_en text,
  description_es text
);

-- Create posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_image text,
  author_id uuid REFERENCES authors(id),
  category_id uuid REFERENCES categories(id),
  published_at timestamptz,
  reading_time integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  title_pt text,
  title_en text,
  title_es text,
  slug_pt text UNIQUE,
  slug_en text UNIQUE,
  slug_es text UNIQUE,
  excerpt_pt text,
  excerpt_en text,
  excerpt_es text,
  content_pt text,
  content_en text,
  content_es text
);

-- Create tags table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_pt text UNIQUE,
  name_en text UNIQUE,
  name_es text UNIQUE
);

-- Create post_tags table
CREATE TABLE post_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, tag_id)
);

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
  created_at timestamptz DEFAULT now()
);

-- Create post_reactions table
CREATE TABLE post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK (emoji IN ('👍', '❤️', '🔥', '👏')),
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, emoji, session_id)
);

-- Create post_analytics table
CREATE TABLE post_analytics (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  lang text NOT NULL,
  view_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  reaction_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  last_viewed_at timestamptz,
  PRIMARY KEY (post_id, lang)
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Helper function for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to admin_users
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create role check functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_editor()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'editor')
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log function
CREATE OR REPLACE FUNCTION audit_log_action()
RETURNS trigger AS $$
DECLARE
  audit_data jsonb;
BEGIN
  audit_data := jsonb_build_object(
    'user_id', auth.uid(),
    'action', TG_OP,
    'table_name', TG_TABLE_NAME,
    'record_id', COALESCE(NEW.id, OLD.id),
    'old_data', CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    'new_data', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );

  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  )
  SELECT
    (audit_data->>'user_id')::uuid,
    audit_data->>'action',
    audit_data->>'table_name',
    (audit_data->>'record_id')::uuid,
    audit_data->'old_data',
    audit_data->'new_data';

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create first admin function
CREATE OR REPLACE FUNCTION create_first_admin(
  user_id_param uuid,
  name_param text
)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE role = 'admin') THEN
    INSERT INTO admin_users (user_id, name, role)
    VALUES (user_id_param, name_param, 'admin');
  ELSE
    RAISE EXCEPTION 'Admin user already exists';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can manage all admin users"
  ON admin_users FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Users can view their own admin status"
  ON admin_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Authors policies
CREATE POLICY "Authors are viewable by everyone"
  ON authors FOR SELECT TO public
  USING (true);

CREATE POLICY "Authors can be managed by editors and admins"
  ON authors FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT TO public
  USING (true);

CREATE POLICY "Categories can be managed by editors and admins"
  ON categories FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT TO public
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Posts can be managed by editors and admins"
  ON posts FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT TO public
  USING (true);

CREATE POLICY "Tags can be managed by editors and admins"
  ON tags FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Post tags policies
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT TO public
  USING (true);

CREATE POLICY "Post tags can be managed by editors and admins"
  ON post_tags FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Comments policies
CREATE POLICY "Anyone can create pending comments"
  ON comments FOR INSERT TO public
  WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT TO public
  USING (status = 'approved');

CREATE POLICY "Comments can be managed by editors and admins"
  ON comments FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Post reactions policies
CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON post_reactions FOR INSERT TO public
  WITH CHECK (true);

-- Post analytics policies
CREATE POLICY "Analytics are viewable by everyone"
  ON post_analytics FOR SELECT TO public
  USING (true);

CREATE POLICY "Analytics can be updated by the system"
  ON post_analytics FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Audit logs policies
CREATE POLICY "Audit logs are viewable by admins only"
  ON audit_logs FOR SELECT TO authenticated
  USING (is_admin());

-- Add audit triggers to relevant tables
CREATE TRIGGER audit_admin_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_posts_changes
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_categories_changes
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_tags_changes
  AFTER INSERT OR UPDATE OR DELETE ON tags
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_comments_changes
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

-- Create analytics functions
CREATE OR REPLACE FUNCTION increment_post_view(
  post_id_param uuid,
  lang_param text DEFAULT 'pt'
)
RETURNS void AS $$
BEGIN
  INSERT INTO post_analytics (post_id, lang, view_count, last_viewed_at)
  VALUES (post_id_param, lang_param, 1, now())
  ON CONFLICT (post_id, lang)
  DO UPDATE SET
    view_count = post_analytics.view_count + 1,
    last_viewed_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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