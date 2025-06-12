import { useEffect, useState } from "react";
import { X } from "lucide-react";
import slugify from "slugify";
import { supabase } from "../../lib/supabase"; // Importar supabase
import toast from 'react-hot-toast'; // Importar toast
import { useTranslation } from "react-i18next"; // Importar useTranslation
import { Tag } from "../../types/blog"; // Importar Tag para tipagem

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // onSave dispara fetchTags no pai (TagList)
  tag?: Tag | null; // Tipagem adicionada, 'tag' é o dado inicial
}

const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tag,
}) => {
  const { t } = useTranslation(); // Inicializar useTranslation
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
    slug_pt: '', // Adicionado para slugs multilíngues
    slug_en: '', // Adicionado para slugs multilíngues
    slug_es: ''  // Adicionado para slugs multilíngues
  });

  useEffect(() => {
    if (tag) {
      // Quando editando, preenche com os dados da tag existente
      setFormData({
        name_pt: tag.name_pt || '', // Assumindo que tag pode ter name_pt, name_en, name_es
        name_en: tag.name_en || '',
        name_es: tag.name_es || '',
        slug_pt: tag.slug_pt || '', // Assumindo que tag pode ter slug_pt, slug_en, slug_es
        slug_en: tag.slug_en || '',
        slug_es: tag.slug_es || ''
      });
    } else {
      // Quando criando novo, limpa o formulário
      setFormData({
        name_pt: '',
        name_en: '',
        name_es: '',
        slug_pt: '',
        slug_en: '',
        slug_es: ''
      });
    }
  }, [tag, isOpen]); // Adicionado isOpen como dependência para resetar ao abrir

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, lang: string) => {
    const value = e.target.value;
    const newSlug = slugify(value, { lower: true, strict: true }); // Gerar slug
    setFormData(prev => ({
      ...prev,
      [`name_${lang}`]: value,
      [`slug_${lang}`]: newSlug // Atualizar slug correspondente
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // A tagData a ser enviada ao Supabase já está em formData
      // Garanta que os slugs estão preenchidos antes de salvar, se não foram alterados
      const dataToSave = { ...formData };
      ['pt', 'en', 'es'].forEach(lang => {
          if (!dataToSave[`slug_${lang}`] && dataToSave[`name_${lang}`]) {
              dataToSave[`slug_${lang}`] = slugify(dataToSave[`name_${lang}`], { lower: true, strict: true });
          }
      });


      if (tag) {
        // Operação de UPDATE
        const { error } = await supabase
          .from('tags')
          .update(dataToSave) // Usar dataToSave com slugs atualizados
          .eq('id', tag.id);

        if (error) {
          console.error('Error updating tag:', error); // Traduzido
          toast.error(t('tag.error_updating_tag', { message: error.message })); // Traduzido
          throw error;
        }
        toast.success(t('tag.updated_success')); // Traduzido
      } else {
        // Operação de INSERT
        const { error } = await supabase
          .from('tags')
          .insert([dataToSave]); // Usar dataToSave com slugs atualizados

        if (error) {
          console.error('Error creating tag:', error); // Traduzido
          toast.error(t('tag.error_creating_tag', { message: error.message })); // Traduzido
          throw error;
        }
        toast.success(t('tag.created_success')); // Traduzido
      }

      onSave(); // Chama a função onSave do componente pai (TagList) para recarregar os dados
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Error saving tag:', error); // Traduzido
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' })); // Traduzido
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
            {tag ? t('tag.edit_tag_title') : t('tag.new_tag_title')} {/* Traduzido */}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['pt', 'en', 'es'].map(lang => (
            <div key={lang}>
              <label className="block text-sm font-medium mb-1">
                {t('common.name_label')} ({lang.toUpperCase()}) {/* Traduzido */}
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={formData[`name_${lang}`]}
                onChange={(e) => handleNameChange(e, lang)} // Passa o evento e o idioma
                required={lang === 'pt'} // Apenas PT é obrigatório
              />
              <label className="block text-sm font-medium mb-1 mt-2">
                {t('common.slug_label')} ({lang.toUpperCase()}) {/* Traduzido */}
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={formData[`slug_${lang}`]}
                onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [`slug_${lang}`]: e.target.value
                }))}
                readOnly // Slug gerado automaticamente, mas pode ser editável se quiser
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              {t('common.cancel_button')} {/* Traduzido */}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              {loading ? t('common.saving_status') : t('common.save_button')} {/* Traduzido */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagModal;