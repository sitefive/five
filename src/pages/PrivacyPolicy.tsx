import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/${lang}/privacy-policy`;

  return (
    <>
      <Header />
      <div className="bg-gray-300 min-h-screen">
        <Helmet>
          <title>{t('privacy.title')} | FIVE Consulting</title>
          <meta name="description" content={t('privacy.description')} />
          <meta property="og:title" content={`${t('privacy.title')} | FIVE Consulting`} />
          <meta property="og:description" content={t('privacy.description')} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 py-32">
          <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
          <p className="mb-4 text-gray-800">
            {t('privacy.intro')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.collection.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.collection.description')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.usage.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.usage.description')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.sharing.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.sharing.description')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.security.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.security.description')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.cookies.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.cookies.description')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.rights.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.rights.description')}
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">{t('privacy.changes.title')}</h2>
          <p className="mb-4 text-gray-800">
            {t('privacy.changes.description')}
          </p>

          <p className="mt-8 text-gray-600 text-sm">
            {t('privacy.lastUpdate', { date: 'Maio de 2025' })}
          </p>
        </div>
      </div>
      <Footer />
      <CookieConsent />
    </>
  );
};

export default PrivacyPolicy;