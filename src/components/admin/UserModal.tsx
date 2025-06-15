import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User, UserFormData, UserModalProps } from '../../types/blog'; // Importar tipos
import { useTranslation } from 'react-i18next'; // Importar useTranslation

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const { t } = useTranslation('admin'); // Inicializar useTranslation
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'editor',
    active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.auth_user?.email || '',
        password: '', // Senha sempre vazia em edição por segurança
        role: user.role || 'editor',
        active: user.active ?? true,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'editor',
        active: true,
      });
    }
  }, [user, isOpen]); // Adicionado isOpen para resetar ao abrir

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose(); // Fecha o modal após salvar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {user ? t('user_modal.edit_user_title') : t('user_modal.new_user_title')} {/* Traduzido */}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.name_label')} {/* Traduzido */}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.email_label')} {/* Traduzido */}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
                disabled={!!user} // Desabilita edição de email para usuários existentes
              />
            </div>

            {!user && ( // Campo de senha só para novos usuários
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.password_label')} {/* Traduzido */}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                  minLength={8}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('user.role_column_header')} {/* Traduzido */}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="editor">{t('user.role_editor')}</option> {/* Traduzido */}
                <option value="admin">{t('user.role_admin')}</option>   {/* Traduzido */}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                {t('user.status_active')} {/* Traduzido */}
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel_button')} {/* Traduzido */}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t('common.save_button')} {/* Traduzido */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;