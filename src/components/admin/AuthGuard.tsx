import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Mudamos o nome do estado para refletir a lógica correta
  const [isAuthorized, setIsAuthorized] = useState(false); 

  useEffect(() => {
    const checkAuthorization = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        navigate('/admin/login', { replace: true });
        return;
      }

      // Verifica se o usuário logado existe na nossa tabela de usuários do painel
      const { data: panelUser, error: panelUserError } = await supabase
        .from('admin_users')
        .select('user_id, role') // Pode selecionar a role para uso futuro
        .eq('user_id', session.user.id)
        .single();

      if (panelUserError && panelUserError.code !== 'PGRST116') {
        console.error('Erro ao verificar permissões:', panelUserError);
        toast.error('Erro ao verificar suas permissões.');
        navigate('/admin/login', { replace: true });
        return;
      }

      // ======================= LÓGICA CORRIGIDA AQUI =======================
      // Se encontrarmos o usuário na tabela (seja ele admin ou editor), ele está autorizado.
      if (panelUser) {
        setIsAuthorized(true);
      } else {
        // Se o usuário está autenticado mas não está na nossa tabela, ele não pertence ao painel.
        console.warn('Usuário autenticado não encontrado na tabela admin_users:', session.user.email);
        toast.error('Você não tem permissão para acessar este painel.');
        navigate('/admin/login', { replace: true });
      }
      // =====================================================================

      setLoading(false);
    };

    checkAuthorization();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthorized(false);
        navigate('/admin/login', { replace: true });
      } else if (event === 'SIGNED_IN') {
        // Quando o usuário faz login, re-checa a autorização
        checkAuthorization();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando permissões...</div>;
  }

  // Se estiver autorizado, renderiza a página. Se não, retorna nulo (pois o redirecionamento já ocorreu).
  return isAuthorized ? <>{children}</> : null;
};

export default AuthGuard;