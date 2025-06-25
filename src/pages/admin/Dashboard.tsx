import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Tag, Users, Settings, PlusCircle, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    subscribers: 0
  });
  
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, categoriesRes, subscribersRes, recentPostsRes] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
          // Nova query para buscar os 5 posts mais recentes
          supabase.from('posts')
            .select('id, title_pt')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        setStats({
          posts: postsRes.count || 0,
          categories: categoriesRes.count || 0,
          subscribers: subscribersRes.count || 0
        });

        if (recentPostsRes.error) throw recentPostsRes.error;
        setRecentPosts(recentPostsRes.data || []);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Link
          to="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Novo Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total de Posts</p>
              <h3 className="text-3xl font-bold">{stats.posts}</h3>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Categorias</p>
              <h3 className="text-3xl font-bold">{stats.categories}</h3>
            </div>
            <Tag className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Inscritos Newsletter</p>
              <h3 className="text-3xl font-bold">{stats.subscribers}</h3>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/posts" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <FileText className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
              <span className="block font-medium text-sm">Gerenciar Posts</span>
            </Link>
            <Link to="/admin/categories" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Tag className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
              <span className="block font-medium text-sm">Gerenciar Categorias</span>
            </Link>
            <Link to="/admin/subscribers" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Users className="w-6 h-6 text-green-600 mb-2 mx-auto" />
              <span className="block font-medium text-sm">Lista de Inscritos</span>
            </Link>
            <Link to="/admin/settings" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Settings className="w-6 h-6 text-gray-600 mb-2 mx-auto" />
              <span className="block font-medium text-sm">Configurações</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Posts Recentes</h2>
          {/* Lógica para exibir os posts recentes */}
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/admin/posts/${post.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
                  >
                    <span className="text-sm text-gray-800 group-hover:text-blue-600 truncate">
                      {post.title_pt || 'Post sem título'}
                    </span>
                    <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum post recente encontrado.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;