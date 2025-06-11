import { useEffect, useState } from "react";
import { X } from "lucide-react";
import slugify from "slugify";
import { supabase } from "../../lib/supabase";
import toast from 'react-hot-toast';
import { Tag } from "../../types/blog";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Tag) => void;
  tag?: Tag | null;
}

const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tag,
}) => {
  const [loading, setLoading] = useState(false);
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
  }, [tag, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagData = {
        ...formData,
        id: tag?.id
      };

      if (tag) {
        const { error } = await supabase
          .from('tags')
          .update(formData)
          .eq('id', tag.id);

        if (error) {
          console.error('Error updating tag:', error);
          toast.error(`Erro ao atualizar tag: ${error.message}`);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([formData]);

        if (error) {
          console.error('Error creating tag:', error);
          toast.error(`Erro ao criar tag: ${error.message}`);
          throw error;
        }
      }

      onSave(tagData as Tag);
      onClose();
    } catch (error: any) {
      console.error('Error saving tag:', error);
      toast.error(`Erro ao salvar tag: ${error.message || 'Verifique o console.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {tag ? "Editar Tag" : "Nova Tag"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['pt', 'en', 'es'].map(lang => (
            <div key={lang}>
              <label className="block text-sm font-medium mb-1">
                Nome ({lang.toUpperCase()})
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={formData[`name_${lang}`]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [`name_${lang}`]: e.target.value
                }))}
                required={lang === 'pt'}
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagModal;