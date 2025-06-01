import React from 'react';
import { useTranslation } from 'react-i18next';
import ParallaxHeader from '../components/ParallaxHeader';

const TermsOfUse = () => {
  const { t } = useTranslation();

  const renderList = (key: string) => {
    const items = t(key, { returnObjects: true });
    return Array.isArray(items) ? (
      <ul className="list-disc list-inside space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    ) : null;
  };

  return (
    <div className="pt-0">
      <ParallaxHeader
        title={t('terms.title')}
        description={t('terms.description')}
        image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl text-gray-800">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-6">{t('terms.title')}</h1>
          <p className="mb-6 leading-relaxed">{t('terms.intro')}</p>
        </section>

        {/* Licença de Uso */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.usageLicense.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.usageLicense.description')}</p>
          {renderList('terms.usageLicense.items')}
        </section>

        {/* Isenção de Responsabilidade */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.disclaimer.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.disclaimer.description')}</p>
          {renderList('terms.disclaimer.items')}
        </section>

        {/* Limitações */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.limitations.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.limitations.description')}</p>
          {renderList('terms.limitations.items')}
        </section>

        {/* Precisão dos Materiais */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.accuracy.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.accuracy.description')}</p>
          {renderList('terms.accuracy.items')}
        </section>

        {/* Links */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.links.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.links.description')}</p>
          {renderList('terms.links.items')}
        </section>

        {/* Legislação Aplicável */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.governingLaw.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.governingLaw.description')}</p>
          {renderList('terms.governingLaw.items')}
        </section>

        <p className="text-gray-600 text-sm mt-10">
          {t('terms.lastUpdate', { date: 'Maio de 2025' })}
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
