import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import slugify from 'slugify';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Category } from '../../types/blog';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  category?: Category | null;
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
  }, [category]);

  const handleNameChange = (value: string, lang: string) => {
    const slug = slugify(value, { lower: true, strict: true });
    setFormData(prev => ({
      ...prev,
      [`name_${lang}`]: value,
      [`slug_${lang}`]: slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', category.id);

        if (error) {
          console.error('Error updating category:', error);
          toast.error(`Erro ao atualizar categoria: ${error.message}`);
          throw error;
        }
      } else {
        const { error } = await supabase.from('categories').insert(formData);
        if (error) {
          console.error('Error creating category:', error);
          toast.error(`Erro ao criar categoria: ${error.message}`);
          throw error;
        }
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(`Erro ao salvar categoria: ${error.message || 'Verifique o console.'}`);
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
              {category ? t('Edit Category') : t('New Category')}
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
                  {lang === 'pt' ? 'Portuguese' : lang === 'en' ? 'English' : 'Spanish'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData[`name_${lang}`]}
                      onChange={(e) => handleNameChange(e.target.value, lang)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required={lang === 'pt'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData[`slug_${lang}`]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [`slug_${lang}`]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      required={lang === 'pt'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;