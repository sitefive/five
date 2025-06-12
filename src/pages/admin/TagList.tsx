import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import TagModal from '../../components/admin/TagModal';
import { Tag } from '../../types/blog'; // Importe a interface Tag

const TagList = () => {
  const { t, i18n } = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]); // Tipagem adicionada
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null); // Tipagem adicionada
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    fetchTags();
  }, [currentLanguage]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      // Mapeia o idioma completo (ex: pt-BR) para o sufixo da coluna no DB (ex: pt)
      const langSuffix = currentLanguage.split('-')[0];

      const { data, error } = await supabase
        .from('tags')
        .select([
          'id',
          `name_${langSuffix} as name`,
          'post_tags(count)'
        ])
        .order(`name_${langSuffix}`);

      if (error) {
        console.error('Error fetching tags:', error);
        toast.error(t('tag.error_loading_tags', { message: error.message })); // Traduzido
        throw error;
      }

      const formattedData = data?.map((tag: any) => ({ // tag tipado como any temporariamente
        id: tag.id,
        name: tag.name, // 'name' já é o alias do name_${langSuffix}
        postCount: tag.post_tags?.length || 0
      })) || [];

      setTags(formattedData);
    } catch (error: any) {
      console.error('Error fetching tags:', error);
      toast.error(t('common.error_loading_data', { message: error.message || 'Verifique o console.' })); // Traduzido
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => { // Tipagem adicionada
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('tag.confirm_delete_tag'))) return; // Traduzido

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tag:', error);
        toast.error(t('tag.error_deleting_tag', { message: error.message })); // Traduzido
        throw error;
      }

      setTags(tags.filter(tag => tag.id !== id));
      toast.success(t('tag.deleted_success')); // Traduzido
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      toast.error(t('common.error_deleting', { message: error.message || 'Verifique o console.' })); // Traduzido
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleModalSave = async (tagData: any) => { // tagData tipado como any por enquanto
    try {
      if (editingTag) {
        const { error } = await supabase
          .from('tags')
          .update(tagData)
          .eq('id', editingTag.id);

        if (error) {
          console.error('Error updating tag:', error);
          toast.error(t('tag.error_updating_tag', { message: error.message })); // Traduzido
          throw error;
        }
        toast.success(t('tag.updated_success')); // Traduzido
      } else {
        const { error } = await supabase.from('tags').insert([tagData]);

        if (error) {
          console.error('Error creating tag:', error);
          toast.error(t('tag.error_creating_tag', { message: error.message })); // Traduzido
          throw error;
        }
        toast.success(t('tag.created_success')); // Traduzido
      }

      handleModalClose();
      fetchTags(); // Recarrega a lista após salvar
    } catch (error: any) {
      console.error('Error saving tag:', error);
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' })); // Traduzido
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('tag.title')}</h1> {/* Traduzido */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('tag.new_tag_button')} {/* Traduzido */}
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('tag.search_placeholder')} {/* Traduzido */}
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
          <option value="pt">{t('common.portuguese')}</option> {/* Traduzido */}
          <option value="en">{t('common.english')}</option>    {/* Traduzido */}
          <option value="es">{t('common.spanish')}</option>    {/* Traduzido */}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">{t('common.loading')}</div> {/* Traduzido */}
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.name_label')} {/* Traduzido */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('tag.posts_count_label')} {/* Traduzido */}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions_label')} {/* Traduzido */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag: Tag) => ( // Tipagem adicionada
                <tr key={tag.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {tag.name || t('common.no_name_fallback')} {/* Traduzido fallback */}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tag.postCount}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
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