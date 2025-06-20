import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar os arquivos de tradução do namespace 'translation' (site público)
import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

// Importar os arquivos de tradução do novo namespace 'admin' (painel administrativo)
// --- INÍCIO DA CORREÇÃO PARA QUEBRA DE CACHE (AGRESSIVA E FINAL) ---
// Mudamos o número do 'v=' para um valor TOTALMENTE NOVO para forçar o recarregamento.
// Use a data e hora atual para torná-lo único
import ptAdmin from './locales/pt/admin.json?v=202506201100'; // <-- NOVO VALOR AQUI!
import enAdmin from './locales/en/admin.json?v=202506201100'; // <-- NOVO VALOR AQUI!
import esAdmin from './locales/es/admin.json?v=202506201100'; // <-- NOVO VALOR AQUI!
// --- FIM DA CORREÇÃO PARA QUEBRA DE CACHE (AGRESSIVA E FINAL) ---

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
    debug: true, // Deixe como true para ver os logs do i18n no console, se ainda houver problemas
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