import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Tag, Users, Settings, PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    posts: 0,
    categories: 0,
    subscribers: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      const [posts, categories, subscribers] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' })
      ]);

      setStats({
        posts: posts.count || 0,
        categories: categories.count || 0,
        subscribers: subscribers.count || 0
      });
    };

    fetchStats();
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
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Categorias</p>
              <h3 className="text-3xl font-bold">{stats.categories}</h3>
            </div>
            <Tag className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Inscritos Newsletter</p>
              <h3 className="text-3xl font-bold">{stats.subscribers}</h3>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/posts"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <span className="block font-medium">Gerenciar Posts</span>
            </Link>
            <Link
              to="/admin/categories"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Tag className="w-6 h-6 text-blue-600 mb-2" />
              <span className="block font-medium">Gerenciar Categorias</span>
            </Link>
            <Link
              to="/admin/subscribers"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <span className="block font-medium">Lista de Inscritos</span>
            </Link>
            <Link
              to="/admin/settings"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-6 h-6 text-blue-600 mb-2" />
              <span className="block font-medium">Configurações</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Posts Recentes</h2>
          <div className="space-y-4">
            {/* Lista de posts recentes será adicionada aqui */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;