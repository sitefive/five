import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Importar useTranslation
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// NOTA: Esta interface reflete a estrutura aninhada do seu estado 'settings' no frontend.
// No banco de dados, as colunas seriam 'value_pt', 'value_en', 'value_es' (tipo JSONB).
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
  const { t } = useTranslation('admin'); // Inicializar useTranslation
  const [loading, setLoading] = useState(true);
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
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Assumimos que a tabela 'settings' tem colunas como 'key', 'value_pt', 'value_en', 'value_es'
        // e que 'key' é 'site' para a linha de configurações do site.
        const { data, error } = await supabase
          .from('settings')
          .select('value_pt, value_en, value_es') // Selecionando diretamente as colunas JSONB
          .eq('key', 'site')
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

        if (data) {
          // Os dados vêm como JSON, então apenas os atribuímos
          setSettings({
            pt: data.value_pt,
            en: data.value_en,
            es: data.value_es
          });
        }
      } catch (error: any) {
        console.error('Error fetching settings:', error);
        toast.error(t('settings.error_loading_settings', { message: error.message || 'Verifique o console.' })); // Traduzido
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [t]); // Adicionado 't' para refetch se o idioma do app mudar, embora raramente necessário aqui

  const handleSave = async () => {
    try {
      setLoading(true);
      // O Supabase irá serializar automaticamente os objetos 'settings.pt', etc., para JSONB
      const { error } = await supabase
        .from('settings')
        .update({
          value_pt: settings.pt,
          value_en: settings.en,
          value_es: settings.es
        })
        .eq('key', 'site'); // Assumimos que a linha de settings é identificada pela 'key' 'site'

      if (error) throw error;

      toast.success(t('settings.saved_success')); // Traduzido
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(t('common.error_saving', { message: error.message || 'Verifique o console.' })); // Traduzido
    } finally {
      setLoading(false);
    }
  };

  // Funções auxiliares para atualizar o estado aninhado
  const updateSettings = (lang: keyof typeof settings, field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const updateNestedSettings = (
    lang: keyof typeof settings,
    parent: keyof SiteSettings,
    field: string, // 'field' pode ser string pois é nome de propriedade dentro de parent
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [parent]: {
          ...(prev[lang][parent] as Record<string, string>), // Cast para acessar propriedades dinamicamente
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>; // Traduzido
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1> {/* Traduzido */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {t('settings.save_changes_button')} {/* Traduzido */}
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
          <h2 className="text-lg font-semibold mb-4">{t('settings.seo_settings_title')}</h2> {/* Traduzido */}
          <div className="space-y-4">
            <div>
              <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.site_title_label')} ({currentLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                id="site_title"
                name="title" // Corrigido para 'title' em vez de 'site_title_lang'
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
                name="description" // Corrigido para 'description'
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
                name="keywords" // Corrigido para 'keywords'
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
                {t('social.facebook_label')} {/* Traduzido */}
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
                {t('social.instagram_label')} {/* Traduzido */}
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
                {t('social.linkedin_label')} {/* Traduzido */}
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
                {t('social.whatsapp_label')} {/* Traduzido */}
              </label>
              <input
                type="text"
                value={settings[currentLanguage].social.whatsapp}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'whatsapp', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="+5511999999999"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">{t('settings.contact_info_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.email_label')}
              </label>
              <input
                type="email"
                value={settings[currentLanguage].contact.email}
                onChange={(e) => updateNestedSettings(currentLanguage, 'contact', 'email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.phone_label')}
              </label>
              <input
                type="text"
                value={settings[currentLanguage].contact.phone}
                onChange={(e) => updateNestedSettings(currentLanguage, 'contact', 'phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">{t('settings.footer_settings_title')}</h2>
          <div className="flex gap-2 mb-4">
            {['pt', 'en', 'es'].map(lang => (
              <button
                key={lang}
                type="button"
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
          <div className="space-y-4">
            <div>
              <label htmlFor="footer_text" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.footer_text_label')} ({currentLanguage.toUpperCase()})
              </label>
              <textarea
                id="footer_text"
                value={settings[currentLanguage].footer.text}
                onChange={(e) => updateNestedSettings(currentLanguage, 'footer', 'text', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="copyright_text" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.copyright_text_label')} ({currentLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                id="copyright_text"
                value={settings[currentLanguage].footer.copyright}
                onChange={(e) => updateNestedSettings(currentLanguage, 'footer', 'copyright', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder={t('settings.copyright_placeholder')}
              />
            </div>
          </div>
        </section>


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading} // Usar 'loading' aqui, ou um estado 'saving' separado se preferir
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            {loading ? t('common.saving_status') : t('settings.save_changes_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;