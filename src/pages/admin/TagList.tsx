import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import TagModal from '../../components/admin/TagModal';
import { Tag } from '../../types/blog';

interface RawTagFromDB {
  id: string;
  name_pt: string; name_en: string; name_es: string;
  slug_pt: string; slug_en: string; slug_es: string;
  post_tags: { count: number }[];
}

const TagList = () => {
  const { t, i18n } = useTranslation('admin');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tags')
        .select(`*, post_tags(count)`)
        .order('name_pt', { ascending: true });

      if (error) throw error;

      const langSuffix = i18n.language.split('-')[0];
      const formattedTags: Tag[] = (data || []).map((rawTag: any) => ({
        id: rawTag.id,
        name: rawTag[`name_${langSuffix}`] || rawTag.name_pt || '',
        slug: rawTag[`slug_${langSuffix}`] || rawTag.slug_pt || '',
        postCount: rawTag.post_tags?.[0]?.count || 0,
        // Manter dados originais para edição
        name_pt: rawTag.name_pt, name_en: rawTag.name_en, name_es: rawTag.name_es,
        slug_pt: rawTag.slug_pt, slug_en: rawTag.slug_en, slug_es: rawTag.slug_es,
      }));
      setTags(formattedTags);

    } catch (error: any) {
      console.error('Error fetching tags:', error);
      toast.error(t('tag.error_loading_tags', { message: error.message }));
    } finally {
      setLoading(false);
    }
  }, [i18n.language, t]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('tag.confirm_delete_tag'))) return;
    try {
      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) throw error;
      toast.success(t('tag.deleted_success'));
      fetchTags();
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      toast.error(t('tag.error_deleting_tag', { message: error.message }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleModalSave = async (formData: any) => {
    setLoading(true);
    try {
      let operationError = null;

      if (editingTag) {
        const { error } = await supabase.from('tags').update(formData).eq('id', editingTag.id);
        operationError = error;
        if (!error) toast.success(t('tag.updated_success'));
      } else {
        const { error } = await supabase.from('tags').insert([formData]);
        operationError = error;
        if (!error) toast.success(t('tag.created_success'));
      }

      if (operationError) throw operationError;

      handleModalClose();
      fetchTags();
    } catch (error: any) {
      console.error('Error saving tag:', error);
      toast.error(t('common.error_saving', { message: error.message }));
    } finally {
        setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('tag.title')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('tag.new_tag_button')}
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('tag.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-4">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.name_label')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('tag.posts_count_label')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions_label')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag: Tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{tag.name || t('common.no_name_fallback')}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tag.postCount}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(tag)} className="text-blue-600 hover:text-blue-900"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <TagModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        tag={editingTag}
      />
    </div>
  );
};

export default TagList;