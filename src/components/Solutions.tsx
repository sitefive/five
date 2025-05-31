import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Users2, 
  HeadphonesIcon, 
  RefreshCw, 
  Settings
} from 'lucide-react';

const Solutions = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  const services = [
    {
      icon: <Users2 className="w-12 h-12 text-blue-600" strokeWidth={1.5} />,
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      link: `/${lang}/servicos/consultoria-especialista`
    },
    {
      icon: <HeadphonesIcon className="w-12 h-12 text-blue-600" strokeWidth={1.5} />,
      title: t('services.support.title'),
      description: t('services.support.description'),
      link: `/${lang}/servicos/suporte-ams`
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-blue-600" strokeWidth={1.5} />,
      title: t('services.revitalization.title'),
      description: t('services.revitalization.description'),
      link: `/${lang}/servicos/revitalizacao`
    },
    {
      icon: <Settings className="w-12 h-12 text-blue-600" strokeWidth={1.5} />,
      title: t('services.optimization.title'),
      description: t('services.optimization.description'),
      link: `/${lang}/servicos/otimizacao-processos`
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center group-hover:text-gray-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;