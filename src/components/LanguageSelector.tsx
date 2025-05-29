import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { lang } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();

  const switchLanguage = (newLang: string) => {
    if (newLang === lang) {
      setOpen(false);
      return;
    }

    // Update i18n language
    i18n.changeLanguage(newLang);

    // Update URL
    const newPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath + location.search, { replace: false });
    setOpen(false);

    // Store language preference
    localStorage.setItem('preferredLanguage', newLang);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
        aria-label="Select language"
      >
        <span>{languages.find(l => l.code === lang)?.label || 'PT'}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[100px]">
          {languages
            .filter(l => l.code !== lang)
            .map(l => (
              <button
                key={l.code}
                onClick={() => switchLanguage(l.code)}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {l.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}