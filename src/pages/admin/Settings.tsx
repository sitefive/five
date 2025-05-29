import React, { useState, useEffect } from 'react';
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [settings, setSettings] = useState<Record<string, SiteSettings>>({
    pt: {
      title: '',
      description: '',
      keywords: '',
      social: {
        facebook: '',
        instagram: '',
        linkedin: '',
        whatsapp: ''
      },
      contact: {
        email: '',
        phone: ''
      },
      footer: {
        text: '',
        copyright: ''
      }
    },
    en: {
      title: '',
      description: '',
      keywords: '',
      social: {
        facebook: '',
        instagram: '',
        linkedin: '',
        whatsapp: ''
      },
      contact: {
        email: '',
        phone: ''
      },
      footer: {
        text: '',
        copyright: ''
      }
    },
    es: {
      title: '',
      description: '',
      keywords: '',
      social: {
        facebook: '',
        instagram: '',
        linkedin: '',
        whatsapp: ''
      },
      contact: {
        email: '',
        phone: ''
      },
      footer: {
        text: '',
        copyright: ''
      }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'site')
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          pt: data.value_pt,
          en: data.value_en,
          es: data.value_es
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
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

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (lang: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const updateNestedSettings = (lang: string, parent: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [parent]: {
          ...prev[lang][parent],
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
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
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                type="text"
                value={settings[currentLanguage].title}
                onChange={(e) => updateSettings(currentLanguage, 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={settings[currentLanguage].description}
                onChange={(e) => updateSettings(currentLanguage, 'description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                value={settings[currentLanguage].keywords}
                onChange={(e) => updateSettings(currentLanguage, 'keywords', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={settings[currentLanguage].social.facebook}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'facebook', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={settings[currentLanguage].social.instagram}
                onChange={(e) => updateNestedSettings(currentLanguage, 'social', 'instagram', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
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
                WhatsApp
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
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
                Phone
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
          <h2 className="text-lg font-semibold mb-4">Footer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Text
              </label>
              <textarea
                value={settings[currentLanguage].footer.text}
                onChange={(e) => updateNestedSettings(currentLanguage, 'footer', 'text', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={settings[currentLanguage].footer.copyright}
                onChange={(e) => updateNestedSettings(currentLanguage, 'footer', 'copyright', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;