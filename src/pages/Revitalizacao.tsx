import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ParallaxHeader from '../components/ParallaxHeader';

const Revitalizacao = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-00">
      <ParallaxHeader
        title={t('services.revitalization.title')}
        description={t('services.revitalization.description')}
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t('services.revitalization.benefits.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t('services.revitalization.benefits.items', { returnObjects: true }).map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">{t('services.methodology.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['diagnosis', 'planning', 'implementation'].map((phase) => (
              <div key={phase} className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">
                  {t(`services.methodology.phases.${phase}.title`)}
                </h3>
                <ul className="space-y-4">
                  {t(`services.methodology.phases.${phase}.steps`, { returnObjects: true }).map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <a
              href="https://api.whatsapp.com/send/?phone=5511910666444&text=Olá! Gostaria de saber mais sobre o serviço de revitalização."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('services.cta')}
              <ArrowRight className="ml-2" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Revitalizacao;