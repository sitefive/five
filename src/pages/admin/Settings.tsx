import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// NOTA: Esta interface reflete a estrutura aninhada do seu estado 'settings' no frontend.
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
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // Estado para a função do usuário
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [settings, setSettings] = useState<Record<string, SiteSettings>>({
    pt: {
      title: '', description: '', keywords: '',
      social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' },
      contact: { email: '', phone: '' },
      footer: { text: '', copyright: '' }
    },
    en: {
      title: '', description: '', keywords: '',
      social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' },
      contact: { email: '', phone: '' },
      footer: { text: '', copyright: '' }
    },
    es: {
      title: '', description: '', keywords: '',
      social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' },
      contact: { email: '', phone: '' },
      footer: { text: '', copyright: '' }
    }
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Busca o usuário atual e as configurações em paralelo
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const [settingsResult, adminUserResult] = await Promise.all([
            supabase.from('settings').select('value_pt, value_en, value_es').eq('key', 'site').single(),
            supabase.from('admin_users').select('role').eq('user_id', user.id).single()
          ]);
          
          const { data: settingsData, error: settingsError } = settingsResult;
          if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
          if (settingsData) {
            setSettings({
              pt: settingsData.value_pt,
              en: settingsData.value_en,
              es: settingsData.value_es
            });
          }

          const { data: adminUser, error: adminUserError } = adminUserResult;
          if (adminUserError && adminUserError.code !== 'PGRST116') throw adminUserError;
          if(adminUser) {
            setCurrentUserRole(adminUser.role);
          }

        } else {
            // Se não houver usuário, nega o acesso (embora o AuthGuard já deva ter feito isso)
            setCurrentUserRole(null);
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
    // ... (o resto da lógica de salvar continua igual)
    try {
      setLoading(true);
      const { error } = await supabase
        .from('settings')
        .update({
          value_pt: settings.pt,
          value_en: settings.en,
          value_es: settings.es
        })
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

  const updateSettings = (lang: keyof typeof settings, field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const updateNestedSettings = (lang: keyof typeof settings, parent: keyof SiteSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [parent]: {
          ...(prev[lang][parent] as Record<string, string>),
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  // ======================= VERIFICAÇÃO DE PERMISSÃO =======================
  // Se o usuário não for admin, mostra a tela de acesso negado
  if (currentUserRole !== 'admin') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('user.access_denied_title')}</h1>
        <p>{t('user.access_denied_message')}</p>
      </div>
    );
  }
  // ========================================================================

  // Se for admin, renderiza o conteúdo normal da página
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {t('settings.save_changes_button')}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {['pt', 'en', 'es'].map(lang => (
            <button
              key={lang}
              onClick={() => setCurrentLanguage(lang)}
              className={`px-3 py-1 rounded ${
                currentLanguage === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">{t('settings.seo_settings_title')}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.site_title_label')} ({currentLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                id="site_title"
                name="title"
                value={settings[currentLanguage].title}
                onChange={(e) => updateSettings(currentLanguage, 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.description_label')} ({currentLanguage.toUpperCase()})
              </label>
              <textarea
                id="description"
                name="description"
                value={settings[currentLanguage].description}
                onChange={(e) => updateSettings(currentLanguage, 'description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.keywords_label')} ({currentLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={settings[currentLanguage].keywords}
                onChange={(e) => updateSettings(currentLanguage, 'keywords', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder={t('settings.keywords_placeholder')}
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">{t('settings.social_media_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('social.facebook_label')}
              </label>
              <input
                type="url"
                value={settings[currentLanguage].social.facebook}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'facebook', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('social.instagram_label')}
              </label>
              <input
                type="url"
                value={settings[currentLanguage].social.instagram}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'instagram', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('social.linkedin_label')}
              </label>
              <input
                type="url"
                value={settings[currentLanguage].social.linkedin}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'linkedin', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('social.whatsapp_label')}
              </label>
              <input
                type="text"
                value={settings[currentLanguage].social.whatsapp}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'whatsapp', e.targe