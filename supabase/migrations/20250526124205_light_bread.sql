/*
  # Security and Audit Log Fixes

  1. Changes
    - Remove request schema dependency
    - Fix audit logging
    - Strengthen RLS policies
    - Add proper admin user management
    
  2. Security
    - Update all RLS policies
    - Fix audit function
    - Add proper role checks
*/

-- Fix audit log function to not depend on request schema
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

-- Recreate admin_users table with proper constraints
DROP TABLE IF EXISTS admin_users CASCADE;
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

-- Add updated_at trigger
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can manage all admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'admin'
      AND au.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'admin'
      AND au.active = true
    )
  );

CREATE POLICY "Users can view their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Helper functions for role checks
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

-- Update posts policies
DROP POLICY IF EXISTS "Posts can be managed by editors and admins" ON posts;
CREATE POLICY "Posts can be managed by editors and admins"
  ON posts
  FOR ALL
  TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Update categories policies
DROP POLICY IF EXISTS "Categories can be managed by editors and admins" ON categories;
CREATE POLICY "Categories can be managed by editors and admins"
  ON categories
  FOR ALL
  TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Update tags policies
DROP POLICY IF EXISTS "Tags can be managed by editors and admins" ON tags;
CREATE POLICY "Tags can be managed by editors and admins"
  ON tags
  FOR ALL
  TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Update comments policies
DROP POLICY IF EXISTS "Admins can manage comments" ON comments;
CREATE POLICY "Admins can manage comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add audit trigger to admin_users
CREATE TRIGGER audit_admin_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION audit_log_action();

-- Function to create first admin user
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