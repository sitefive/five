-- Migração para alterar senha do admin atual
-- SUBSTITUA 'NOVA_SENHA_AQUI' pela sua nova senha

DO $$
DECLARE
    admin_email text := 'celso.ferreira@hotmail.com';
    new_password text := 'NOVA_SENHA_AQUI'; -- SUBSTITUA pela nova senha
BEGIN
    -- Atualizar a senha do usuário
    UPDATE auth.users 
    SET 
        encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = now()
    WHERE email = admin_email;
    
    -- Verificar se a atualização foi bem-sucedida
    IF FOUND THEN
        RAISE NOTICE 'Senha alterada com sucesso para: %', admin_email;
    ELSE
        RAISE NOTICE 'Usuário não encontrado: %', admin_email;
    END IF;
    
END $$;