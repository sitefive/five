import React from 'react';
import { useTranslation } from 'react-i18next';

import logoEmpresa1 from '../assets/logo-empresa1.png';
import logoEmpresa2 from '../assets/logo-empresa2.png';

const Cases = () => {
  const { t } = useTranslation();

  return (
    <section id="cases" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('cases.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('cases.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-center max-w-4xl mx-auto">
          <div className="flex justify-center">
            <img
              src={logoEmpresa1}
              alt="Logo da primeira empresa parceira"
              className="h-24 w-auto object-contain"
            />
          </div>
          <div className="flex justify-center">
            <img
              src={logoEmpresa2}
              alt="Logo da segunda empresa parceira"
              className="h-24 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cases;
