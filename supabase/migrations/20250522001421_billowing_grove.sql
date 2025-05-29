/*
  # Final Security Enhancements

  1. Security Updates
    - Strengthen RLS policies
    - Add audit logging
    - Implement rate limiting
    - Add security functions

  2. Changes
    - Create audit_logs table
    - Add security policies
    - Add helper functions
    - Update existing policies
*/

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Audit logs are viewable by admins only"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND active = true
  ));

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
    'new_data', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    'ip_address', request.header('x-forwarded-for')
  );

  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address
  )
  SELECT
    (audit_data->>'user_id')::uuid,
    audit_data->>'action',
    audit_data->>'table_name',
    (audit_data->>'record_id')::uuid,
    audit_data->'old_data',
    audit_data->'new_data',
    audit_data->>'ip_address';

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to all relevant tables
CREATE TRIGGER audit_posts_changes
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_categories_changes
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_tags_changes
  AFTER INSERT OR UPDATE OR DELETE ON tags
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_admin_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

CREATE TRIGGER audit_settings_changes
  AFTER INSERT OR UPDATE OR DELETE ON settings
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

-- Update RLS policies for posts
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
CREATE POLICY "Published posts are viewable by everyone"
  ON posts
  FOR SELECT
  TO public
  USING (
    published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY "Posts can be managed by editors and admins"
  ON posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
  );

-- Update RLS policies for categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories can be managed by editors and admins"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
  );

-- Update RLS policies for tags
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
CREATE POLICY "Tags are viewable by everyone"
  ON tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Tags can be managed by editors and admins"
  ON tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
      AND active = true
    )
  );

-- Create rate limiting function for auth attempts
CREATE OR REPLACE FUNCTION check_rate_limit(
  identifier text,
  max_attempts integer DEFAULT 5,
  window_minutes integer DEFAULT 15
)
RETURNS boolean AS $$
DECLARE
  current_count integer;
BEGIN
  -- Clean up old attempts
  DELETE FROM auth.audit_log_entries
  WHERE created_at < now() - (window_minutes || ' minutes')::interval;
  
  -- Count recent attempts
  SELECT COUNT(*)
  INTO current_count
  FROM auth.audit_log_entries
  WHERE actor_id = identifier
  AND created_at > now() - (window_minutes || ' minutes')::interval;
  
  RETURN current_count < max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;