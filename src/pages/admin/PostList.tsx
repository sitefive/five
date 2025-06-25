import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Post } from '../../types/blog';

const PostList = () => {
  const { t, i18n } = useTranslation('admin');
  const [posts, setPosts] = useState<any[]>([]); // Usando any para acomodar os joins
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const langSuffix = i18n.language.split('-')[0];

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          published_at,
          title_pt,
          author:authors(name),
          category:categories(name_pt),
          post_tags:post_tags(tag:tags(id, name_pt))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error(t('post.error_loading_posts', { message: error.message }));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handleDelete = async (id: string) => {
    if (!window.confirm(t('post.confirm_delete_post'))) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      toast.success(t('post.deleted_success'));
      fetchPosts();
    } catch (error: any) {
        toast.error(t('post.error_deleting_post', { message: error.message }));
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title_pt?.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('post.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('post.title_label')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('post.author_label')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('post.category_label')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('post.status_label')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions_label')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 max-w-xs">
                  <Link to={`/admin/posts/${post.id}`} className="text-sm font-medium text-blue-600 hover:underline truncate block">
                    {post.title_pt || t('common.no_title_fallback')}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author?.name || t('common.no_author_fallback')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category?.name_pt || t('common.no_category_fallback')}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  {post.post_tags?.map((pt: any) => pt.tag.name_pt).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {post.published_at ? t('post.status_published') : t('post.status_draft')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <Link to={`/admin/posts/${post.id}`} className="text-blue-600 hover:text-blue-900"><Edit className="w-5 h-5" /></Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostList;