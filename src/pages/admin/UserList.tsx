import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import UserModal from '../../components/admin/UserModal';
import { User, UserFormData } from '../../types/blog';
import { useTranslation } from 'react-i18next';

const UserList = () => {
  const { t } = useTranslation('admin');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('id, user_id, name, role, active, created_at')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setCurrentUser(adminUser);
      }
    } catch (error: any) {
      console.error('Erro ao carregar usuário atual:', error);
      toast.error(t('user.error_loading_current_user', { message: error.message || 'Verifique o console.' }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          id,
          user_id,
          name,
          role,
          active,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error(t('user.error_loading_users', { message: error.message }));
        throw error;
      }

      // --- INÍCIO DA CORREÇÃO DEFINITIVA PARA BUSCAR EMAIL ---
      const usersWithEmails = await Promise.all(data.map(async (adminUser: any) => {
        // Chamar a função do banco de dados (RPC) para obter o email
        const { data: emailData, error: emailError } = await supabase.rpc('get_user_email_by_id', { user_uuid: adminUser.user_id });
        
        if (emailError) {
          console.error(`Erro ao buscar email para ${adminUser.name} (user_id: ${adminUser.user_id}):`, emailError);
          // Retornar o usuário sem email ou com uma mensagem de erro se a função falhar
          return { ...adminUser, auth_user: { email: t('user.email_not_found') } };
        }
        return { ...adminUser, auth_user: { email: emailData } }; // emailData é a string do email
      }));
      // --- FIM DA CORREÇÃO DEFINITIVA PARA BUSCAR EMAIL ---

      setUsers(usersWithEmails || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(t('common.error_loading_data', { message: error.message || 'Verifique o console.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('user.confirm_delete_user'))) return;

    try {
      const { data: adminUserData, error: fetchError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!adminUserData?.user_id) throw new Error(t('user.user_id_not_found'));

      const { error: adminDeleteError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (adminDeleteError) throw adminDeleteError;

      // --- ATENÇÃO: deletar o usuário do auth.users. Isso DEVE ser feito com chave service_role ou por Admin API
      // Deletar do Supabase Auth (auth.users)
      // Como não usamos a service_role key no frontend, isso pode falhar.
      // Se esta parte ainda falhar, seria necessário criar uma EDGE FUNCTION ou outra RPC para deletar usuários da tabela auth.users com segurança.
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(adminUserData.user_id);

      if (authDeleteError) throw authDeleteError;

      setUsers(users.filter(user => user.id !== id));
      toast.success(t('user.user_deleted_success'));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(t('common.error_deleting', { message: error.message || 'Verifique o console.' }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSave = async (userData: UserFormData) => {
    try {
      if (editingUser) {
        const { error: adminUpdateError } = await supabase
          .from('admin_users')
          .update({
            name: userData.name,
            role: userData.role,
            active: userData.active
          })
          .eq('id', editingUser.id);

        if (adminUpdateError) throw adminUpdateError;
        toast.success(t('user.user_updated_success'));
      } else {
        // Criar auth user primeiro (também usa API de Admin, pode precisar de ajuste futuro)
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true
        });

        if (authError) throw authError;

        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{
            user_id: authUser.user.id,
            name: userData.name,
            role: userData.role,
            active: userData.active
          }]);

        if (adminError) throw adminError;
        toast.success(t('user.user_created_success'));
      }

      handleModalClose();
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' }));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.auth_user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('user.access_denied_title')}</h1>
        <p>{t('user.access_denied_message')}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('user.title')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('user.new_user_button')}
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('user.search_placeholder')}
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
                  {t('common.email_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('user.role_column_header')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('user.status_column_header')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions_label')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user: User) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.auth_user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? t('user.role_admin') : t('user.role_editor')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? t('user.status_active') : t('user.status_inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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

      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        user={editingUser}
      />
    </div>
  );
};

export default UserList;