import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import UserModal from '../../components/admin/UserModal';
import { User, UserFormData } from '../../types/blog'; // Importar User e UserFormData
import { useTranslation } from 'react-i18next'; // Importar useTranslation

const UserList = () => {
  const { t } = useTranslation(); // Inicializar useTranslation
  const [users, setUsers] = useState<User[]>([]); // Tipagem adicionada
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null); // Tipagem adicionada
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Tipagem adicionada

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
          .select('id, user_id, name, role, active, created_at') // Seleciona apenas o que precisa
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 é "no rows returned"

        setCurrentUser(adminUser);
      }
    } catch (error: any) {
      console.error('Erro ao carregar usuário atual:', error); // Traduzido
      toast.error(t('user.error_loading_current_user', { message: error.message || 'Verifique o console.' })); // Traduzido
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
        `) // Não fazemos mais o join aqui, pegaremos o email separadamente
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error(t('user.error_loading_users', { message: error.message })); // Traduzido
        throw error;
      }

      // Agora, vamos buscar os emails de auth.users separadamente para cada usuário
      const usersWithEmails = await Promise.all(data.map(async (adminUser: any) => {
        const { data: authUserData, error: authUserError } = await supabase.auth.admin.getUserById(adminUser.user_id);
        if (authUserError) {
          console.error(`Erro ao buscar email para ${adminUser.name}:`, authUserError);
          // Retornar o usuário sem email se houver erro, para não quebrar a lista
          return { ...adminUser, auth_user: { email: t('user.email_not_found') } }; // Traduzido
        }
        return { ...adminUser, auth_user: { email: authUserData.user?.email } };
      }));

      setUsers(usersWithEmails || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(t('common.error_loading_data', { message: error.message || 'Verifique o console.' })); // Traduzido
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => { // Tipagem adicionada
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('user.confirm_delete_user'))) return; // Traduzido

    try {
      // Primeiro, obtenha o user_id da tabela admin_users antes de deletar
      const { data: adminUserData, error: fetchError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!adminUserData?.user_id) throw new Error(t('user.user_id_not_found')); // Traduzido

      // Deletar da tabela admin_users
      const { error: adminDeleteError } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (adminDeleteError) throw adminDeleteError;

      // Deletar do Supabase Auth (auth.users)
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(adminUserData.user_id);

      if (authDeleteError) throw authDeleteError;

      setUsers(users.filter(user => user.id !== id));
      toast.success(t('user.user_deleted_success')); // Traduzido
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(t('common.error_deleting', { message: error.message || 'Verifique o console.' })); // Traduzido
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSave = async (userData: UserFormData) => { // Tipagem adicionada
    try {
      if (editingUser) {
        // Atualizar admin_users (name, role, active)
        const { error: adminUpdateError } = await supabase
          .from('admin_users')
          .update({
            name: userData.name,
            role: userData.role,
            active: userData.active
          })
          .eq('id', editingUser.id);

        if (adminUpdateError) throw adminUpdateError;
        toast.success(t('user.user_updated_success')); // Traduzido
      } else {
        // Criar auth user primeiro
        const { data: authUser, error: authError } = await supabase.auth.admin.