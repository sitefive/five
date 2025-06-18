import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar os arquivos de tradução do namespace 'translation' (site público)
import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

// Importar os arquivos de tradução do novo namespace 'admin' (painel administrativo)
// --- INÍCIO DA CORREÇÃO PARA QUEBRA DE CACHE (TEMPORÁRIA) ---
// Adicionando um query parameter único para forçar o navegador a recarregar
// Você pode mudar o número do 'v=' a cada novo deploy, se precisar forçar novamente
import ptAdmin from './locales/pt/admin.json?v=2025061801'; // <-- MUDANÇA AQUI
import enAdmin from './locales/en/admin.json?v=2025061801'; // <-- MUDANÇA AQUI
import esAdmin from './locales/es/admin.json?v=2025061801'; // <-- MUDANÇA AQUI
// --- FIM DA CORREÇÃO PARA QUEBRA DE CACHE (TEMPORÁRIA) ---

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: ptTranslation,
        admin: ptAdmin
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
    fallbackLng: 'pt',
    debug: true, // Ligar o debug para ver o que o i18n está fazendo no console
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage'],
    },
    ns: ['translation', 'admin'],
    defaultNS: 'translation'
  });

export default i18n;