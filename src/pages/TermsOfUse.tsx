import React from 'react';
import { useTranslation } from 'react-i18next';
import ParallaxHeader from '../components/ParallaxHeader';

const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-0">
      <ParallaxHeader
        title={t('terms.title')}
        description={t('terms.description')}
        image="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-6">{t('terms.title')}</h1>
          <p className="mb-6 leading-relaxed">{t('terms.intro')}</p>
        </section>

        {/* Seções principais */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.acceptance.title')}</h2>
          <p className="leading-relaxed">{t('terms.acceptance.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.eligibility.title')}</h2>
          <p className="leading-relaxed">{t('terms.eligibility.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.account.title')}</h2>
          <p className="leading-relaxed">{t('terms.account.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.usage.title')}</h2>
          <p className="leading-relaxed">{t('terms.usage.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.intellectual.title')}</h2>
          <p className="leading-relaxed">{t('terms.intellectual.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.privacy.title')}</h2>
          <p className="leading-relaxed">{t('terms.privacy.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.liability.title')}</h2>
          <p className="leading-relaxed">{t('terms.liability.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.termination.title')}</h2>
          <p className="leading-relaxed">{t('terms.termination.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.changes.title')}</h2>
          <p className="leading-relaxed">{t('terms.changes.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.contact.title')}</h2>
          <p className="leading-relaxed">{t('terms.contact.description')}</p>
        </section>

        <p className="text-gray-600 text-sm mt-10">
          {t('terms.lastUpdate', { date: 'Maio de 2025' })}
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;