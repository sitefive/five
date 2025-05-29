import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const handleCustomize = () => {
    window.location.href = '/privacy-policy';
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          {t('cookies.message')}{' '}
          <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
            {t('cookies.privacyLink')}
          </Link>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {t('cookies.accept')}
          </button>
          <button
            onClick={handleCustomize}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {t('cookies.customize')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;