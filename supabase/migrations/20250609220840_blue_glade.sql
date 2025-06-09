/*
  # Criar usuário admin com verificação de duplicação

  1. Verificações
    - Verifica se o usuário já existe antes de criar
    - Atualiza dados se necessário
    - Garante que o admin_users tenha o registro correto

  2. Segurança
    - Mantém integridade dos dados
    - Evita duplicações
    - Preserva dados existentes
*/

-- Função para criar ou atualizar usuário admin
DO $$
DECLARE
    user_uuid uuid;
    existing_user_id uuid;
BEGIN
    -- Verificar se o usuário já existe
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'celso.ferreira@hotmail.com';

    IF existing_user_id IS NULL THEN
        -- Criar novo usuário se não existir
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
        ) RETURNING id INTO user_uuid;
        
        -- Criar identidade para o novo usuário
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
            user_uuid,
            jsonb_build_object(
                'sub', user_uuid::text,
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
    ELSE
        -- Usar o ID do usuário existente
        user_uuid := existing_user_id;
        
        -- Atualizar senha se necessário
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('FiveConsulting2025!', gen_salt('bf')),
            updated_at = now(),
            email_confirmed_at = COALESCE(email_confirmed_at, now())
        WHERE id = user_uuid;
        
        -- Verificar se a identidade existe, se não, criar
        IF NOT EXISTS (
            SELECT 1 FROM auth.identities 
            WHERE user_id = user_uuid AND provider = 'email'
        ) THEN
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
                user_uuid,
                jsonb_build_object(
                    'sub', user_uuid::text,
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
        END IF;
    END IF;

    -- Verificar se o registro admin_users existe
    IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = user_uuid) THEN
        -- Atualizar registro existente
        UPDATE admin_users 
        SET 
            name = 'Celso Ferreira',
            role = 'admin',
            active = true,
            updated_at = now()
        WHERE user_id = user_uuid;
    ELSE
        -- Criar novo registro admin_users
        INSERT INTO admin_users (
            user_id,
            name,
            role,
            active,
            created_at,
            updated_at
        ) VALUES (
            user_uuid,
            'Celso Ferreira',
            'admin',
            true,
            now(),
            now()
        );
    END IF;

    RAISE NOTICE 'Usuário admin configurado com sucesso: %', user_uuid;
END $$;