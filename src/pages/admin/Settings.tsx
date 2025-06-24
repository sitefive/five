import React, { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SiteSettings {
  title: string;
  description: string;
  keywords: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  footer: {
    text: string;
    copyright: string;
  };
}

const Settings = () => {
  const { t } = useTranslation('admin');
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [settings, setSettings] = useState<Record<string, SiteSettings>>({
    pt: { title: '', description: '', keywords: '', social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' }, contact: { email: '', phone: '' }, footer: { text: '', copyright: '' } },
    en: { title: '', description: '', keywords: '', social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' }, contact: { email: '', phone: '' }, footer: { text: '', copyright: '' } },
    es: { title: '', description: '', keywords: '', social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' }, contact: { email: '', phone: '' }, footer: { text: '', copyright: '' } }
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const [settingsResult, adminUserResult] = await Promise.all([
          supabase.from('settings').select('value_pt, value_en, value_es').eq('key', 'site').single(),
          supabase.from('admin_users').select('role').eq('user_id', user.id).single()
        ]);

        const { data: settingsData, error: settingsError } = settingsResult;
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        if (settingsData) {
          setSettings({
            pt: settingsData.value_pt || initialState.pt,
            en: settingsData.value_en || initialState.en,
            es: settingsData.value_es || initialState.es
          });
        }

        const { data: adminUser, error: adminUserError } = adminUserResult;
        if (adminUserError && adminUserError.code !== 'PGRST116') throw adminUserError;
        if (adminUser) {
          setCurrentUserRole(adminUser.role);
        }

      } catch (error: any) {
        console.error('Error fetching initial data for settings:', error);
        toast.error(t('settings.error_loading_settings', { message: error.message || 'Verifique o console.' }));
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [t]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('settings')
        .update({ value_pt: settings.pt, value_en: settings.en, value_es: settings.es })
        .eq('key', 'site');
      if (error) throw error;
      toast.success(t('settings.saved_success'));
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' }));
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (lang: string, field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
  };

  const updateNestedSettings = (lang: string, parent: keyof SiteSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [parent]: { ...(prev[lang][parent] as object), [field]: value } }
    }));
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (currentUserRole !== 'admin') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('user.access_denied_title')}</h1>
        <p>{t('user.access_denied_message')}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? t('common.saving_status') : t('settings.save_changes_button')}
        </button>
      </div>

      <div className="