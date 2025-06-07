/*
  # Criar usuário admin

  1. Novo usuário de autenticação
    - Email: celso.ferreira@hotmail.com
    - Senha: FiveConsulting2025!
    - Role: admin
  
  2. Configuração
    - Usuário confirmado e ativo
    - Identidade para login via email
    - Registro na tabela admin_users
*/

-- Criar o usuário de autenticação
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
  'celso.ferreira@hotmail.com',
  crypt('FiveConsulting2025!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Celso Ferreira"}',
  false,
  'authenticated',
  'authenticated'
);

-- Criar uma identidade para o usuário (necessário para login)
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
  (SELECT id FROM auth.users WHERE email = 'celso.ferreira@hotmail.com'),
  jsonb_build_object(
    'sub', (SELECT id FROM auth.users WHERE email = 'celso.ferreira@hotmail.com')::text,
    'email', 'celso.ferreira@hotmail.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  'celso.ferreira@hotmail.com',
  now(),
  now(),
  'celso.ferreira@hotmail.com'
);

-- Criar o registro na tabela admin_users
INSERT INTO admin_users (
  user_id,
  name,
  role,
  active,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'celso.ferreira@hotmail.com'),
  'Celso Ferreira',
  'admin',
  true,
  now(),
  now()
);