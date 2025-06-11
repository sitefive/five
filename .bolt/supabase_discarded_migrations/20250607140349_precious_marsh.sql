/*
  # Criar usuário admin completo

  1. Criação do usuário de autenticação
    - Usuário: celso.ferreira@hotmail.com
    - Senha: FiveConsulting2025!
    - Email confirmado automaticamente
  
  2. Criação do registro admin
    - Nome: Celso Ferreira
    - Role: admin
    - Status: ativo
  
  3. Criação da identidade
    - Provider: email
    - Dados necessários para autenticação
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
  aud,
  confirmation_token,
  email_confirmed_at,
  phone_confirmed_at,
  confirmed_at
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
  'authenticated',
  '',
  now(),
  null,
  now()
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