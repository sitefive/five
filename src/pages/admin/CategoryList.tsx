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
  name_pt: string; name_en: string; name_es: string;
  slug_pt: string; slug_en: string; slug_es: string;
  description_pt: string; description_en: string; description_es: string;
}

const CategoryList = () => {
  const { t, i18n } = useTranslation('admin');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // O idioma da UI agora é pego diretamente do hook i18n
  const currentLanguage = i18n.language.split('-')[0];

  useEffect(() => {
    fetchCategories();
  }, []); // O fetch inicial não precisa depender do idioma, pois já pegamos todas as colunas

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name_pt, name_en, name_es,
          slug_pt, slug_en, slug_es,
          description_pt, description_en, description_es
        `)
        .order('name_pt', { ascending: true });

      if (error) throw error;

      // A formatação agora acontece aqui, usando o idioma da UI
      const formattedCategories: Category[] = (data || []).map(rawCategory => {
        const langSuffix = currentLanguage as keyof RawCategoryFromDB;
        return {
          id: rawCategory.id,
          name: rawCategory[`name_${langSuffix}`] || rawCategory.name_pt || '',
          slug: rawCategory[`slug_${langSuffix}`] || rawCategory.slug_pt || '',
          description: rawCategory[`description_${langSuffix}`] || rawCategory.description_pt || '',
          // Manter todos os dados originais para edição
          name_pt: rawCategory.name_pt, name_en: rawCategory.name_en, name_es: rawCategory.name_es,
          slug_pt: rawCategory.slug_pt, slug_en: rawCategory.slug_en, slug_es: rawCategory.slug_es,
          description_pt: rawCategory.description_pt, description_en: rawCategory.description_en, description_es: rawCategory.description_es
        };
      });
      setCategories(formattedCategories);

    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error(t('category.error_loading_categories', { message: error.message }));
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
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success(t('category.deleted_success'));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(t('category.error_deleting_category', { message: error.message }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // ========================== FUNÇÃO DE SALVAR CORRIGIDA ==========================
  const handleModalSave = async (formData: any) => {
    // A 'formData' vem do modal com uma estrutura como: { pt: { name: '...' }, en: { name: '...' } }
    try {
        // 1. Criamos um objeto "plano" e seguro para enviar ao Supabase
        const dataToSave = {
            name_pt: formData.pt?.name || '',
            slug_pt: formData.pt?.slug || '',
            description_pt: formData.pt?.description || '',
            name_en: formData.en?.name || '',
            slug_en: formData.en?.slug || '',
            description_en: formData.en?.description || '',
            name_es: formData.es?.name || '',
            slug_es: formData.es?.slug || '',
            description_es: formData.es?.description || '',
        };

        let operationError = null;

        if (editingCategory) {
            // 2. Modo de Edição
            const { error } = await supabase
                .from('categories')
                .update(dataToSave)
                .eq('id', editingCategory.id);
            operationError = error;
            if (!error) toast.success(t('category.updated_success'));
        } else {
            // 3. Modo de Criação
            const { error } = await supabase.from('categories').insert([dataToSave]);
            operationError = error;
            if (!error) toast.success(t('category.created_success'));
        }

        if (operationError) throw operationError;

        handleModalClose();
        fetchCategories(); // Re-busca as categorias para atualizar a lista

    } catch (error: any) {
        console.error('Error saving category:', error);
        toast.error(t('common.error_saving', { message: error.message }));
    }
  };
  // ==============================================================================

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

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('category.search_placeholder')}
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
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
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