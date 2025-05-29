import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import slugify from 'slugify';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  tag?: any;
}

const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tag
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: ''
  });

  useEffect(() => {
    if (tag) {
      setFormData({
        name_pt: tag.name_pt || '',
        name_en: tag.name_en || '',
        name_es: tag.name_es || ''
      });
    } else {
      setFormData({
        name_pt: '',
        name_en: '',
        name_es: ''
      });
    }
  }, [tag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {tag ? 'Edit Tag' : 'New Tag'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData[`name_${lang}`]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [`name_${lang}`]: e.target.value
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    required={lang === 'pt'}
                  />
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
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TagModal;