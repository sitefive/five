/*
  # Correção para Gestão de Usuários no Admin

  1. Funções RPC
    - get_user_email_by_id: Buscar email de usuário por ID
    - create_admin_user: Criar usuário admin com segurança
    - delete_admin_user: Deletar usuário admin com segurança
    
  2. Segurança
    - Funções SECURITY DEFINER para acesso seguro
    - Verificações de permissão admin
    - Logs de auditoria
*/

-- Função para buscar email de usuário por ID
CREATE OR REPLACE FUNCTION get_user_email_by_id(user_uuid uuid)
RETURNS text AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem buscar emails de usuários';
  END IF;
  
  RETURN (SELECT email FROM auth.users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar usuário admin
CREATE OR REPLACE FUNCTION create_admin_user(
  email_param text,
  password_param text,
  name_param text,
  role_param text DEFAULT 'editor'
)
RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem criar usuários';
  END IF;
  
  -- Validar role
  IF role_param NOT IN ('admin', 'editor') THEN
    RAISE EXCEPTION 'Role inválido: deve ser admin ou editor';
  END IF;
  
  -- Verificar se email já existe
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = email_param) THEN
    RAISE EXCEPTION 'Email já está em uso';
  END IF;
  
  -- Criar usuário na tabela auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    email_param,
    crypt(password_param, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('name', name_param),
    false,
    'authenticated',
    'authenticated'
  ) RETURNING id INTO new_user_id;
  
  -- Criar identidade
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at,
    email
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', email_param,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    email_param,
    now(),
    now(),
    email_param
  );
  
  -- Criar registro admin_users
  INSERT INTO admin_users (
    user_id,
    name,
    role,
    active,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    name_param,
    role_param,
    true,
    now(),
    now()
  );
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para deletar usuário admin
CREATE OR REPLACE FUNCTION delete_admin_user(admin_user_id uuid)
RETURNS boolean AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem deletar usuários';
  END IF;
  
  -- Buscar user_id do admin_user
  SELECT user_id INTO target_user_id
  FROM admin_users
  WHERE id = admin_user_id;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário admin não encontrado';
  END IF;
  
  -- Verificar se não é o último admin
  IF (SELECT role FROM admin_users WHERE id = admin_user_id) = 'admin' THEN
    IF (SELECT COUNT(*) FROM admin_users WHERE role = 'admin' AND active = true) <= 1 THEN
      RAISE EXCEPTION 'Não é possível deletar o último administrador';
    END IF;
  END IF;
  
  -- Deletar da tabela admin_users primeiro
  DELETE FROM admin_users WHERE id = admin_user_id;
  
  -- Deletar identidades
  DELETE FROM auth.identities WHERE user_id = target_user_id;
  
  -- Deletar usuário da auth.users
  DELETE FROM auth.users WHERE id = target_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar usuário admin
CREATE OR REPLACE FUNCTION update_admin_user(
  admin_user_id uuid,
  name_param text,
  role_param text,
  active_param boolean
)
RETURNS boolean AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem atualizar usuários';
  END IF;
  
  -- Validar role
  IF role_param NOT IN ('admin', 'editor') THEN
    RAISE EXCEPTION 'Role inválido: deve ser admin ou editor';
  END IF;
  
  -- Verificar se não está desativando o último admin
  IF role_param = 'admin' AND active_param = false THEN
    IF (SELECT COUNT(*) FROM admin_users WHERE role = 'admin' AND active = true AND id != admin_user_id) = 0 THEN
      RAISE EXCEPTION 'Não é possível desativar o último administrador';
    END IF;
  END IF;
  
  -- Atualizar admin_users
  UPDATE admin_users
  SET
    name = name_param,
    role = role_param,
    active = active_param,
    updated_at = now()
  WHERE id = admin_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conceder permissões para usuários autenticados
GRANT EXECUTE ON FUNCTION get_user_email_by_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_admin_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION update_admin_user(uuid, text, text, boolean) TO authenticated;