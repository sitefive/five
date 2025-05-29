export const getBrowserLanguage = (): 'pt' | 'en' | 'es' => {
  // Get stored preference first
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang && ['pt', 'en', 'es'].includes(storedLang)) {
    return storedLang as 'pt' | 'en' | 'es';
  }

  // Fall back to browser language
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('en')) return 'en';
  
  return 'pt'; // Default fallback
};