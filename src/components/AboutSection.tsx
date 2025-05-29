import React from 'react';
import { Target, Award, Users2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gray-50" id="experts">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('about.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
              <Target className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold mb-4">{t('about.focus.title')}</h3>
            <p className="text-gray-600">{t('about.focus.description')}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
              <Award className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold mb-4">{t('about.automation.title')}</h3>
            <p className="text-gray-600">{t('about.automation.description')}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
              <Users2 className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold mb-4">{t('about.consulting.title')}</h3>
            <p className="text-gray-600">{t('about.consulting.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;