/*
  # Create admin user safely

  1. Check if user exists before creating
  2. Create user only if it doesn't exist
  3. Create identity and admin_users records safely
  4. Handle all potential duplicate key violations
*/

-- Função para criar usuário admin de forma segura
DO $$
DECLARE
    user_uuid uuid;
    existing_user_id uuid;
BEGIN
    -- Verificar se o usuário já existe
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'celso.ferreira@hotmail.com';
    
    -- Se o usuário não existe, criar
    IF existing_user_id IS NULL THEN
        -- Gerar UUID para o novo usuário
        user_uuid := gen_random_uuid();
        
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
            user_uuid,
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
        
        existing_user_id := user_uuid;
    END IF;
    
    -- Verificar se a identidade já existe
    IF NOT EXISTS (
        SELECT 1 FROM auth.identities 
        WHERE user_id = existing_user_id AND provider = 'email'
    ) THEN
        -- Criar uma identidade para o usuário
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
            existing_user_id,
            jsonb_build_object(
                'sub', existing_user_id::text,
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
    
    -- Verificar se o admin_user já existe
    IF NOT EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = existing_user_id
    ) THEN
        -- Criar o registro na tabela admin_users
        INSERT INTO admin_users (
            user_id,
            name,
            role,
            active,
            created_at,
            updated_at
        ) VALUES (
            existing_user_id,
            'Celso Ferreira',
            'admin',
            true,
            now(),
            now()
        );
    ELSE
        -- Se já existe, atualizar para garantir que está ativo e com role admin
        UPDATE admin_users 
        SET 
            name = 'Celso Ferreira',
            role = 'admin',
            active = true,
            updated_at = now()
        WHERE user_id = existing_user_id;
    END IF;
    
END $$;