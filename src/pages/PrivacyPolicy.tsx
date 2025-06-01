import React from 'react';
import { useTranslation } from 'react-i18next';
import ParallaxHeader from '../components/ParallaxHeader';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-0">
      <ParallaxHeader
        title={t('privacy.title')}
        description={t('privacy.description')}
        image="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
          <p className="mb-6 leading-relaxed">{t('privacy.intro')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.collection.title')}</h2>
          <p className="leading-relaxed">{t('privacy.collection.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.usage.title')}</h2>
          <p className="leading-relaxed">{t('privacy.usage.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.sharing.title')}</h2>
          <p className="leading-relaxed">{t('privacy.sharing.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.security.title')}</h2>
          <p className="leading-relaxed">{t('privacy.security.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.cookies.title')}</h2>
          <p className="leading-relaxed">{t('privacy.cookies.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.rights.title')}</h2>
          <p className="leading-relaxed">{t('privacy.rights.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('privacy.changes.title')}</h2>
          <p className="leading-relaxed">{t('privacy.changes.description')}</p>
        </section>

        <p className="text-gray-600 text-sm mt-10">
          {t('privacy.lastUpdate', { date: 'Maio de 2025' })}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
