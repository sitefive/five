import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import CategoryModal from '../../components/admin/CategoryModal';
import { Category } from '../../types/blog';

// Interface auxiliar para os dados brutos que vêm do DB antes de formatar
interface RawCategoryFromDB {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  slug_pt: string;
  slug_en: string;
  slug_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
}

const CategoryList = () => {
  const { t, i18n } = useTranslation('admin');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    fetchCategories();
  }, [currentLanguage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const langSuffix = currentLanguage.split('-')[0];

      // --- INÍCIO DA CORREÇÃO DEFINITIVA DA QUERY ---
      // Buscar todas as colunas de idioma
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name_pt, name_en, name_es,
          slug_pt, slug_en, slug_es,
          description_pt, description_en, description_es
        `); // REMOVIDO ALIAS E ADICIONADO TODOS OS CAMPOS _lang

      if (error) {
        console.error('Error fetching categories - Supabase response:', error);
        toast.error(`Erro ao carregar categorias: ${error.message || JSON.stringify(error) || 'Erro desconhecido.'}`);
        throw error;
      }

      // FORMATAR OS DADOS NO FRONTEND
      const formattedCategories: Category[] = (data as RawCategoryFromDB[] || []).map(rawCategory => {
        const categoryName = rawCategory[`name_${langSuffix}` as keyof RawCategoryFromDB];
        const categorySlug = rawCategory[`slug_${langSuffix}` as keyof RawCategoryFromDB];
        const categoryDescription = rawCategory[`description_${langSuffix}` as keyof RawCategoryFromDB];

        return {
          id: rawCategory.id,
          name: categoryName as string,
          slug: categorySlug as string,
          description: categoryDescription as string,
        };
      });
      setCategories(formattedCategories);
      // --- FIM DA CORREÇÃO DEFINITIVA DA QUERY ---

    } catch (error: any) {
      console.error('Error fetching categories - Catch block:', error);
      toast.error(`Erro ao carregar categorias: ${error.message || JSON.stringify(error) || 'Erro desconhecido no catch.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('category.confirm_delete_category'))) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error(t('category.error_deleting_category', { message: error.message }));
        throw error;
      }

      setCategories(categories.filter(cat => cat.id !== id));
      toast.success(t('category.deleted_success'));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(t('common.error_deleting', { message: error.message || 'Verifique o console.' }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSave = async (categoryData: any) => {
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) {
          console.error('Error updating category:', error);
          toast.error(t('category.error_updating_category', { message: error.message }));
          throw error;
        }
        toast.success(t('category.updated_success'));
      } else {
        const { error } = await supabase.from('categories').insert([categoryData]);

        if (error) {
          console.error('Error creating category:', error);
          toast.error(t('category.error_creating_category', { message: error.message }));
          throw error;
        }
        toast.success(t('category.created_success'));
      }

      handleModalClose();
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' }));
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('category.title')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('category.new_category_button')}
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('category.search_placeholder')}
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
                  {t('common.name_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.slug_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.description_label')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions_label')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category: Category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name || t('common.no_name_fallback')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoryList;