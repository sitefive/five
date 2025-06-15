import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar os arquivos de tradução do namespace 'translation' (site público)
import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

// Importar os arquivos de tradução do novo namespace 'admin' (painel administrativo)
import ptAdmin from './locales/pt/admin.json';
import enAdmin from './locales/en/admin.json';
import esAdmin from './locales/es/admin.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Adicionar os recursos para os dois namespaces
    resources: {
      pt: {
        translation: ptTranslation, // Namespace padrão
        admin: ptAdmin              // Novo namespace 'admin'
      },
      en: {
        translation: enTranslation,
        admin: enAdmin
      },
      es: {
        translation: esTranslation,
        admin: esAdmin
      },
    },
    fallbackLng: 'pt', // Idioma de fallback (Português)
    debug: false, // Mudar para true durante o desenvolvimento para depurar traduções
    interpolation: {
      escapeValue: false, // React já escapa valores para você
    },
    detection: {
      order: ['localStorage', 'navigator'], // Ordem de detecção de idioma
      lookupLocalStorage: 'preferredLanguage', // Chave no localStorage para idioma preferido
      caches: ['localStorage'], // Onde armazenar o idioma detectado
    },
    // Definir os namespaces disponíveis e o namespace padrão
    ns: ['translation', 'admin'], // Todos os namespaces disponíveis
    defaultNS: 'translation' // Namespace padrão (se t('chave') for chamado sem prefixo)
  });

export default i18n;