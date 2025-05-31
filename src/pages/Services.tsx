import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeadphonesIcon, RefreshCw, Settings, Users2 } from 'lucide-react';
import ParallaxHeader from '../components/ParallaxHeader';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Users2 className="w-12 h-12 text-blue-200" />,
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      slug: 'consultoria-especialista'
    },
    {
      icon: <HeadphonesIcon className="w-12 h-12 text-blue-600" />,
      title: t('services.support.title'),
      description: t('services.support.description'),
      slug: 'suporte-ams'
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-blue-600" />,
      title: t('services.revitalization.title'),
      description: t('services.revitalization.description'),
      slug: 'revitalizacao'
    },
    {
      icon: <Settings className="w-12 h-12 text-blue-600" />,
      title: t('services.optimization.title'),
      description: t('services.optimization.description'),
      slug: 'otimizacao-processos'
    }
  ];

  return (
    <div className="pt-00">
      <ParallaxHeader
        title={t('services.title')}
        description={t('services.subtitle')}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={`/servicos/${service.slug}`}
              className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center text-center"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                {t('cases.viewCase')}
                <svg 
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;