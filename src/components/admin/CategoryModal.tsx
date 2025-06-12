import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import slugify from 'slugify';
import { supabase } from '../../lib/supabase'; // Importe o supabase
import toast from 'react-hot-toast'; // Importe o toast
import { Category } from '../../types/blog'; // Importe Category para tipagem

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // onSave dispara fetchCategories no pai
  category?: Category; // Tipagem adicionada
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
    slug_pt: '',
    slug_en: '',
    slug_es: '',
    description_pt: '',
    description_en: '',
    description_es: ''
  });

  useEffect(() => {
    if (category) {
      // Quando editando, preenche com os dados da categoria existente
      setFormData({
        name_pt: category.name_pt || '',
        name_en: category.name_en || '',
        name_es: category.name_es || '',
        slug_pt: category.slug_pt || '',
        slug_en: category.slug_en || '',
        slug_es: category.slug_es || '',
        description_pt: category.description_pt || '',
        description_en: category.description_en || '',
        description_es: category.description_es || ''
      });
    } else {
      // Quando criando novo, limpa o formulário
      setFormData({
        name_pt: '',
        name_en: '',
        name_es: '',
        slug_pt: '',
        slug_en: '',
        slug_es: '',
        description_pt: '',
        description_en: '',
        description_es: ''
      });
    }
  }, [category, isOpen]); // Adicionado isOpen como dependência para resetar ao abrir

  const handleNameChange = (value: string, lang: string) => {
    const slug = slugify(value, { lower: true, strict: true });
    setFormData(prev => ({
      ...prev,
      [`name_${lang}`]: value,
      [`slug_${lang}`]: slug
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        // Operação de UPDATE
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', category.id);

        if (error) throw error;
        toast.success(t('category.updated_success')); // Traduzido
      } else {
        // Operação de INSERT
        const { error } = await supabase.from('categories').insert([formData]);
        if (error) throw error;
        toast.success(t('category.created_success')); // Traduzido
      }

      onSave(); // Chama a função onSave do componente pai (CategoryList) para recarregar os dados
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Error saving category:', error); // Traduzido
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' })); // Traduzido
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {category ? t('category.edit_category_title') : t('category.new_category_title')} {/* Traduzido */}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {['pt', 'en', 'es'].map(lang => (
              <div key={lang} className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {lang === 'pt' ? t('common.portuguese') : lang === 'en' ? t('common.english') : t('common.spanish')} {/* Traduzido */}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('common.name_label')} {/* Traduzido */}
                    </label>
                    <input
                      type="text"
                      value={formData[`name_${lang}`]}
                      onChange={(e) => handleNameChange(e.target.value, lang)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required={lang === 'pt'} // Apenas PT é obrigatório
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('common.slug_label')} {/* Traduzido */}
                    </label>
                    <input
                      type="text"
                      value={formData[`slug_${lang}`]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [`slug_${lang}`]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      required={lang === 'pt'} // Apenas PT é obrigatório
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('common.description_label')} {/* Traduzido */}
                    </label>
                    <textarea
                      value={formData[`description_${lang}`]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [`description_${lang}`]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel_button')} {/* Traduzido */}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {loading ? t('common.saving_status') : t('common.save_button')} {/* Traduzido */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;