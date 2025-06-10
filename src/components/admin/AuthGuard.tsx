import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast'; // Importe o toast para mensagens

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false); // Novo estado para controlar a permissão de admin

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        setLoading(true); // Reinicia o loading a cada execução
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          toast.error('Erro ao verificar sessão.');
          navigate('/admin/login', { replace: true });
          return;
        }

        if (!session) {
          // Sem sessão, redireciona para o login
          navigate('/admin/login', { replace: true });
          return;
        }

        // --- INÍCIO DA LÓGICA DE VERIFICAÇÃO DE ADMIN ---
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users') // Sua tabela de administradores
          .select('role')      // Seleciona a coluna 'role'
          .eq('user_id', session.user.id) // Filtra pelo ID do usuário logado
          .single(); // Espera uma única linha

        if (adminError && adminError.code !== 'PGRST116') { // PGRST116 é "no rows returned"
          // Se for um erro real na consulta (não apenas "não encontrou a linha")
          console.error('Erro ao verificar role de admin:', adminError);
          toast.error('Erro ao verificar suas permissões.');
          navigate('/admin/login', { replace: true }); // Redireciona para o login em caso de erro grave
          return;
        }

        if (adminData?.role === 'admin') {
          // Usuário é admin! Permite o acesso.
          setIsAuthenticatedAdmin(true);
        } else {
          // Usuário logado, mas NÃO é admin na tabela admin_users
          console.warn('Usuário logado, mas não é admin:', session.user.email);
          toast.error('Você não tem permissão de administrador.');
          navigate('/admin/login', { replace: true }); // Redireciona para o login ou uma página de "acesso negado"
        }
        // --- FIM DA LÓGICA DE VERIFICAÇÃO DE ADMIN ---

      } catch (error: any) {
        console.error('Erro geral no AuthGuard:', error.message);
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
        navigate('/admin/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndRole();

    // Listener para mudanças de estado de autenticação (sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/admin/login', { replace: true });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Quando o usuário faz login ou o token é atualizado, re-checa a role
          checkAuthAndRole();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]); // Adicionei 'navigate' às dependências do useEffect

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando permissões...</div>;
  }

  // Se não for um admin autenticado, retorna null (já foi redirecionado)
  if (!isAuthenticatedAdmin) {
    return null;
  }

  // Se for admin, renderiza os filhos (o conteúdo da rota protegida)
  return <>{children}</>;
};

export default AuthGuard;