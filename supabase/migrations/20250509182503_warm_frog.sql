/*
  # Adiciona trigger para envio automático de newsletter

  1. Alterações
    - Cria função que dispara webhook quando um post é publicado
    - Adiciona trigger na tabela posts
    
  2. Segurança
    - Função executada com permissões de security definer
*/

-- Criar função que será chamada pelo trigger
CREATE OR REPLACE FUNCTION public.handle_new_post()
RETURNS trigger AS $$
BEGIN
  IF (NEW.published_at IS NOT NULL AND OLD.published_at IS NULL) THEN
    -- Chama a Edge Function quando um post é publicado
    PERFORM
      net.http_post(
        url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/send-newsletter'),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key'))
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que monitora publicações de posts
CREATE TRIGGER on_post_published
  AFTER INSERT OR UPDATE OF published_at
  ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_post();