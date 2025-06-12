import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Post, Author, Category } from '../../types/blog'; // Certifique-se de que Author e Category são importados para tipagem

const PostList = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]); // Tipagem adicionada
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    fetchPosts();
  }, [currentLanguage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // --- INÍCIO DA CORREÇÃO DE IDIOMA ---
      // Mapeia o idioma completo (ex: pt-BR) para o sufixo da coluna no DB (ex: pt)
      const langSuffix = currentLanguage.split('-')[0];
      // --- FIM DA CORREÇÃO DE IDIOMA ---

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title_${langSuffix} as title, /* CORRIGIDO: usa langSuffix */
          slug_${langSuffix} as slug,   /* CORRIGIDO: usa langSuffix */
          published_at,
          created_at,
          featured,
          author:authors(name_${langSuffix} as name), /* CORRIGIDO: usa langSuffix */
          category:categories(name_${langSuffix} as name) /* CORRIGIDO: usa langSuffix */
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        toast.error(`Erro ao carregar posts: ${error.message}`);
        throw error; // Re-lança o erro para o catch externo
      }

      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error(`Erro ao carregar posts: ${error.message || 'Verifique o console.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return; // Traduzido

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        toast.error(`Erro ao deletar post: ${error.message}`);
        throw error;
      }

      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post excluído com sucesso!'); // Traduzido
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(`Erro ao deletar post: ${error.message || 'Verifique o console.'}`);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1> {/* Título em EN, será traduzido pelo i18n */}
        <Link
          to="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post {/* Botão em EN, será traduzido pelo i18n */}
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search posts..." /* Placeholder em EN, será traduzido pelo i18n */
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="pt">Portuguese</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div> /* Mensagem em EN, será traduzido pelo i18n */
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title {/* Cabeçalho em EN, será traduzido pelo i18n */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author {/* Cabeçalho em EN, será traduzido pelo i18n */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category {/* Cabeçalho em EN, será traduzido pelo i18n */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status {/* Cabeçalho em EN, será traduzido pelo i18n */}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions {/* Cabeçalho em EN, será traduzido pelo i18n */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post: Post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title || '(Sem título)'} {/* Traduzido fallback */}
                    </div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.author?.name || 'Sem autor'} {/* Traduzido fallback */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.category?.name || 'Sem categoria'} {/* Traduzido fallback */}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published_at
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published_at ? 'Publicado' : 'Rascunho'} {/* Traduzido */}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/posts/${post.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostList;