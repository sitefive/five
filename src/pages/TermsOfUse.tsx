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
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-6">{t('terms.title')}</h1>
          <p className="mb-6 leading-relaxed">{t('terms.intro')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.usage.title')}</h2>
          <p className="leading-relaxed">{t('terms.usage.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.userResponsibilities.title')}</h2>
          <p className="leading-relaxed">{t('terms.userResponsibilities.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.externalLinks.title')}</h2>
          <p className="leading-relaxed">{t('terms.externalLinks.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.modifications.title')}</h2>
          <p className="leading-relaxed">{t('terms.modifications.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.liabilityLimitation.title')}</h2>
          <p className="leading-relaxed">{t('terms.liabilityLimitation.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.applicableLaw.title')}</h2>
          <p className="leading-relaxed">{t('terms.applicableLaw.description')}</p>
        </section>

        <p className="text-gray-600 text-sm mt-10">
          {t('terms.lastUpdate', { date: 'Maio de 2025' })}
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
