import React from 'react';
import { ArrowRight, Building, Users, TrendingUp, CheckCircle, Factory, ShoppingBag, Heart, GraduationCap, Pill, Truck, Building2, Laptop, UserCheck, HardHat, Shield, Hotel } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Cases = () => {
  const { t } = useTranslation();

  const sectors = [
    { icon: Factory, name: t('cases.sectors.list.industry') },
    { icon: ShoppingBag, name: t('cases.sectors.list.retail') },
    { icon: Heart, name: t('cases.sectors.list.health') },
    { icon: GraduationCap, name: t('cases.sectors.list.education') },
    { icon: Pill, name: t('cases.sectors.list.pharmaceutical') },
    { icon: Truck, name: t('cases.sectors.list.logistics') },
    { icon: Building2, name: t('cases.sectors.list.finance') },
    { icon: Laptop, name: t('cases.sectors.list.technology') },
    { icon: UserCheck, name: t('cases.sectors.list.hr') },
    { icon: HardHat, name: t('cases.sectors.list.construction') },
    { icon: Shield, name: t('cases.sectors.list.fraud') },
    { icon: Hotel, name: t('cases.sectors.list.hospitality') }
  ];

  const recentCases = [
    {
      company: t('cases.recent.clearsale.company'),
      segment: t('cases.recent.clearsale.segment'),
      service: t('cases.recent.clearsale.service'),
      challenge: t('cases.recent.clearsale.challenge'),
      actions: t('cases.recent.clearsale.actions', { returnObjects: true }),
      results: t('cases.recent.clearsale.results', { returnObjects: true }),
      color: 'bg-blue-600'
    },
    {
      company: t('cases.recent.mitre.company'),
      segment: t('cases.recent.mitre.segment'),
      service: t('cases.recent.mitre.service'),
      challenge: t('cases.recent.mitre.challenge'),
      actions: t('cases.recent.mitre.actions', { returnObjects: true }),
      results: t('cases.recent.mitre.results', { returnObjects: true }),
      color: 'bg-blue-600'
    }
  ];

  return (
    <section id="cases" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Nossa Trajetória */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('cases.trajectory.title')}</h2>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('cases.trajectory.description1')} 
              <strong className="text-blue-600"> {t('cases.trajectory.description2')}</strong> 
              {t('cases.trajectory.description3')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('cases.trajectory.description4')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('cases.trajectory.description5')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            <div className="bg-blue-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">+100</div>
              <div className="text-lg text-gray-700">{t('cases.trajectory.stats.companies')}</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">+10</div>
              <div className="text-lg text-gray-700">{t('cases.trajectory.stats.experience')}</div>
            </div>
          </div>
        </div>

        {/* Setores de Atuação */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">{t('cases.sectors.title')}</h2>
          
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            {t('cases.sectors.description')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {sectors.map((sector, index) => {
              const IconComponent = sector.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                  <div className="mb-4 flex justify-center">
                    <IconComponent className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  </div>
                  <div className="text-sm font-medium text-gray-700">{sector.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cases Recentes */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">{t('cases.recent.title')}</h2>

          <div className="space-y-8 max-w-6xl mx-auto">
            {recentCases.map((case_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`${case_.color} text-white p-6`}>
                  <div className="flex items-center mb-4">
                    <Building className="w-8 h-8 mr-3" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-2xl font-bold">{case_.company}</h3>
                      <p className="text-blue-100">Segmento: {case_.segment}</p>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="font-semibold mb-2">Serviço: {case_.service}</p>
                    <p><strong>Desafio:</strong> {case_.challenge}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Atuação */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" strokeWidth={1.5} />
                        {t('cases.recent.labels.actions')}
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(case_.actions) && case_.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start">
                            <span className="text-blue-600 mr-3 mt-1">•</span>
                            <span className="text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resultados */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" strokeWidth={1.5} />
                        {t('cases.recent.labels.results')}
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(case_.results) && case_.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 mr-2 text-blue-600 mt-0.5" strokeWidth={1.5} />
                            <span className="text-gray-700">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('cases.cta.title')}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {t('cases.cta.description')}
            </p>
            <a
              href="https://api.whatsapp.com/send/?phone=5511910666444&text=Olá! Gostaria de saber mais sobre como vocês podem ajudar minha empresa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('cases.cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cases;