-- Migração para criar novo usuário admin
-- SUBSTITUA os valores abaixo pelos seus dados

DO $$
DECLARE
    user_uuid uuid;
    existing_user_id uuid;
    new_email text := 'SEU_EMAIL@AQUI.COM'; -- SUBSTITUA pelo seu email
    new_password text := 'SUA_SENHA_AQUI'; -- SUBSTITUA pela sua senha
    new_name text := 'SEU NOME COMPLETO'; -- SUBSTITUA pelo seu nome
BEGIN
    -- Verificar se o usuário já existe
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = new_email;
    
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
            new_email,
            crypt(new_password, gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            jsonb_build_object('name', new_name),
            false,
            'authenticated',
            'authenticated'
        );
        
        existing_user_id := user_uuid;
        
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
                'email', new_email,
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            new_email,
            now(),
            now(),
            new_email
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
            existing_user_id,
            new_name,
            'admin',
            true,
            now(),
            now()
        );
        
        RAISE NOTICE 'Novo usuário admin criado com sucesso: %', new_email;
    ELSE
        RAISE NOTICE 'Usuário já existe: %', new_email;
    END IF;
    
END $$;