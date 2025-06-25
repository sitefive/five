import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import slugify from "slugify";
import { useTranslation } from "react-i18next";
import { Tag } from "../../types/blog";

interface TagFormData {
    name: string;
    slug: string;
}

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: TagFormData) => void;
  tag?: Tag | null;
}

const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tag,
}) => {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = useState<TagFormData>({ name: '', slug: '' });

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || '',
        slug: tag.slug || ''
      });
    } else {
      setFormData({ name: '', slug: '' });
    }
  }, [tag, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newSlug = slugify(value, { lower: true, strict: true });
    setFormData({ name: value, slug: newSlug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {tag ? t('tag.edit_tag_title') : t('tag.new_tag_title')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('common.name_label')}
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('common.slug_label')}
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              value={formData.slug}
              readOnly
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              {t('common.cancel_button')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {t('common.save_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagModal;