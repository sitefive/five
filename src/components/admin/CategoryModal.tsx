import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import slugify from 'slugify';
import { Category } from '../../types/blog';

interface CategoryFormData {
    name_pt: string; name_en: string; name_es: string;
    slug_pt: string; slug_en: string; slug_es: string;
    description_pt: string; description_en: string; description_es: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CategoryFormData) => void; // A função onSave agora espera receber os dados
  category?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category
}) => {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = useState<CategoryFormData>({
    name_pt: '', name_en: '', name_es: '',
    slug_pt: '', slug_en: '', slug_es: '',
    description_pt: '', description_en: '', description_es: ''
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
        name_pt: '', name_en: '', name_es: '',
        slug_pt: '', slug_en: '', slug_es: '',
        description_pt: '', description_en: '', description_es: ''
      });
    }
  }, [category, isOpen]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A única responsabilidade do modal agora é passar os dados para o pai.
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {category ? t('category.edit_category_title') : t('category.new_category_title')}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {['pt', 'en', 'es'].map(lang => (
              <div key={lang} className="border-b pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-4">
                  {lang === 'pt' ? t('common.portuguese') : lang === 'en' ? t('common.english') : t('common.spanish')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('common.name_label')}</label>
                    <input
                      type="text"
                      value={(formData as any)[`name_${lang}`]}
                      onChange={(e) => handleNameChange(e.target.value, lang)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required={lang === 'pt'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('common.slug_label')}</label>
                    <input
                      type="text"
                      name={`slug_${lang}`}
                      value={(formData as any)[`slug_${lang}`]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('common.description_label')}</label>
                    <textarea
                      name={`description_${lang}`}
                      value={(formData as any)[`description_${lang}`]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                {t('common.cancel_button')}
              </button>
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                {t('common.save_button')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;