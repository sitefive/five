import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Post, Author, Category } from '../../types/blog';

// Interface auxiliar para os dados brutos que vêm do DB antes de formatar
interface RawPostFromDB {
  id: string;
  published_at: string | null;
  created_at: string;
  featured: boolean;
  slug_pt: string; // Buscar todos os slugs
  slug_en: string;
  slug_es: string;
  title_pt: string; // Buscar todos os títulos
  title_en: string;
  title_es: string;
  author: { // Buscar todos os nomes de autor
    id: string;
    name_pt: string;
    name_en: string;
    name_es: string;
  } | null; // Pode ser nulo se não houver autor
  category: { // Buscar todos os nomes de categoria
    id: string;
    name_pt: string;
    name_en: string;
    name_es: string;
  } | null; // Pode ser nulo se não houver categoria
  // Adicione outras colunas _pt, _en, _es que você usa (excerpt, content)
}

const PostList = () => {
  const { t, i18n } = useTranslation('admin');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    fetchPosts();
  }, [currentLanguage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const langSuffix = currentLanguage.split('-')[0]; // pt, en, es

      // --- INÍCIO DA CORREÇÃO DEFINITIVA DA QUERY ---
      // Buscar todas as colunas de idioma e relacionamentos completos
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          published_at,
          created_at,
          featured,
          slug_pt, slug_en, slug_es,
          title_pt, title_en, title_es,
          author:authors(id, name_pt, name_en, name_es),
          category:categories(id, name_pt, name_en, name_es)
        `) // REMOVIDO ALIAS 'as name' E ADICIONADO TODOS OS CAMPOS _lang
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts - Supabase response:', error);
        toast.error(`Erro ao carregar posts: ${error.message || JSON.stringify(error) || 'Erro desconhecido.'}`);
        throw error;
      }

      // FORMATAR OS DADOS NO FRONTEND
      const formattedPosts: Post[] = (data as RawPostFromDB[] || []).map(rawPost => {
        const postTitle = rawPost[`title_${langSuffix}` as keyof RawPostFromDB] || rawPost.title_pt; // Pega o título no idioma atual, ou PT como fallback
        const postSlug = rawPost[`slug_${langSuffix}` as keyof RawPostFromDB] || rawPost.slug_pt; // Pega o slug no idioma atual, ou PT como fallback
        const authorName = rawPost.author?.[`name_${langSuffix}` as keyof typeof rawPost.author] || rawPost.author?.name_pt; // Pega o nome do autor no idioma atual
        const categoryName = rawPost.category?.[`name_${langSuffix}` as keyof typeof rawPost.category] || rawPost.category?.name_pt; // Pega o nome da categoria no idioma atual

        return {
          id: rawPost.id,
          title: postTitle as string, // Cast para string
          slug: postSlug as string, // Cast para string
          published_at: rawPost.published_at,
          created_at: rawPost.created_at,
          featured: rawPost.featured,
          // Esses campos não são mais trazidos pela query direta, então seriam nulos ou indefinidos
          content: '', // Preencher se for necessário (não é para listagem)
          excerpt: '', // Preencher se for necessário (não é para listagem)
          cover_url: '', // Preencher se for necessário (não é para listagem)
          language: langSuffix, // O idioma que estamos exibindo
          category_id: rawPost.category?.id || '',
          author: rawPost.author ? { id: rawPost.author.id, name: authorName as string } : undefined, // Formatar objeto Author
          category: rawPost.category ? { id: rawPost.category.id, name: categoryName as string, slug: rawPost[`slug_${langSuffix}` as keyof RawPostFromDB] as string } : undefined, // Formatar objeto Category
          tags: [] // Tags são carregadas separadamente ou em PostEditor
        };
      });
      setPosts(formattedPosts);
      // --- FIM DA CORREÇÃO DEFINITIVA DA QUERY ---

    } catch (error: any) {
      console.error('Error fetching posts - Catch block:', error);
      toast.error(`Erro ao carregar posts: ${error.message || JSON.stringify(error) || 'Erro desconhecido no catch.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('post.confirm_delete_post'))) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        toast.error(t('post.error_deleting_post', { message: error.message }));
        throw error;
      }

      setPosts(posts.filter(post => post.id !== id));
      toast.success(t('post.deleted_success'));
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(t('common.error_deleting', { message: error.message || 'Verifique o console.' }));
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('post.title_list')}</h1>
        <Link
          to="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('post.new_post_button')}
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('post.search_placeholder')}
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
          <option value="pt">{t('common.portuguese')}</option>
          <option value="en">{t('common.english')}</option>
          <option value="es">{t('common.spanish')}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.title_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('post.author_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('post.category_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('post.status_label')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions_label')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post: Post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title || t('common.no_title_fallback')}
                    </div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.author?.name || t('common.no_author_fallback')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.category?.name || t('common.no_category_fallback')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published_at
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published_at ? t('post.status_published') : t('post.status_draft')}
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