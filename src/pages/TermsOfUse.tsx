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

        {/* Licença de Uso */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.usageLicense.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.usageLicense.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.usageLicense.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.usageLicense.termination')}</p>
        </section>

        {/* Isenção de Responsabilidade */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.disclaimer.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.disclaimer.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.disclaimer.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.disclaimer.termination')}</p>
        </section>

        {/* Limitações */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.limitations.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.limitations.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.limitations.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.limitations.termination')}</p>
        </section>

        {/* Precisão dos Materiais */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.accuracy.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.accuracy.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.accuracy.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.accuracy.termination')}</p>
        </section>

        {/* Links */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.links.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.links.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.links.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.links.termination')}</p>
        </section>

        {/* Modificações */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.changes.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.changes.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.changes.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.changes.termination')}</p>
        </section>

        {/* Legislação Aplicável */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t('terms.governingLaw.title')}</h2>
          <p className="leading-relaxed mb-4">{t('terms.governingLaw.description')}</p>
          <ul className="list-disc list-inside space-y-2">
            {t('terms.governingLaw.items', { returnObjects: true }).map(
              (item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              )
            )}
          </ul>
          <p className="leading-relaxed mt-4">{t('terms.governingLaw.termination')}</p>
        </section>

        <p className="text-gray-600 text-sm mt-10">
          {t('terms.lastUpdate', { date: 'Maio de 2025' })}
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
