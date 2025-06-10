import React from 'react';
import { ArrowRight, Building, Users, TrendingUp, CheckCircle } from 'lucide-react';
import ParallaxHeader from '../components/ParallaxHeader';

const Cases = () => {
  const sectors = [
    { icon: '🏭', name: 'Indústria' },
    { icon: '🛍️', name: 'Varejo' },
    { icon: '🏥', name: 'Saúde' },
    { icon: '🎓', name: 'Educação' },
    { icon: '💊', name: 'Farmacêutico' },
    { icon: '🚚', name: 'Logística' },
    { icon: '🏦', name: 'Finanças' },
    { icon: '💻', name: 'Tecnologia' },
    { icon: '👥', name: 'Recursos Humanos internos de grandes grupos' },
    { icon: '🏗️', name: 'Construção Civil' },
    { icon: '🛡️', name: 'Prevenção a Fraudes' }
  ];

  const recentCases = [
    {
      company: 'ClearSale',
      segment: 'Prevenção a Fraudes',
      service: 'Suporte AMS mensal',
      challenge: 'Reduzir o backlog de chamados e melhorar o tempo de resposta nas demandas internas.',
      actions: [
        'Atendimento contínuo via modelo AMS',
        'Gestão estratégica dos chamados',
        'Apoio técnico na estabilização do ambiente'
      ],
      results: [
        'Redução expressiva do backlog',
        'Mais fluidez e eficiência no atendimento às áreas de negócio'
      ],
      color: 'bg-blue-600'
    },
    {
      company: 'Mitre',
      segment: 'Construção Civil',
      service: 'Consultoria pontual',
      challenge: 'Melhorar o processo de admissão e integração de novos colaboradores com foco em eficiência e digitalização.',
      actions: [
        'Diagnóstico do fluxo de admissão',
        'Otimização do processo com foco em experiência do colaborador',
        'Criação de relatórios personalizados com foco em assinatura digital'
      ],
      results: [
        'Processo mais ágil e digital',
        'Aumento no controle e conformidade com as etapas de admissão'
      ],
      color: 'bg-green-600'
    }
  ];

  return (
    <div className="pt-00">
      <ParallaxHeader
        title="Cases de Sucesso"
        description="Conheça nossa trajetória e os resultados que entregamos para empresas de diversos segmentos."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Nossa Trajetória */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Nossa Trajetória</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Antes mesmo da fundação da Five Consulting, nossa equipe já havia participado de projetos em{' '} 
              <strong className="text-blue-600">mais de 100 empresas</strong> de diversos portes e segmentos.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Essa jornada consolidou nossa experiência em implementação de sistemas de RH, suporte técnico, 
              otimização de processos, treinamentos e consultoria estratégica.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Com essa bagagem, conseguimos entender rapidamente os desafios do seu negócio e entregar 
              soluções sob medida com agilidade, profundidade técnica e foco em resultado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">+100</div>
              <div className="text-lg text-gray-700">Empresas atendidas</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">+10</div>
              <div className="text-lg text-gray-700">Anos de experiência em projetos de RH</div>
            </div>
          </div>
        </section>

        {/* Setores de Atuação */}
        <section className="mb-30">
          <div className="flex items-center mb-8">
            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Setores em que atuamos</h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-8">
            A experiência da nossa equipe se estende por projetos em empresas de variados setores da economia, incluindo:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectors.map((sector, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-3xl mb-2">{sector.icon}</div>
                <div className="text-sm font-medium text-gray-700">{sector.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Cases Recentes */}
        <section>
          <div className="flex items-center mb-8">
            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Cases Recentes</h2>
          </div>

          <div className="space-y-8">
            {recentCases.map((case_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`${case_.color} text-white p-6`}>
                  <div className="flex items-center mb-4">
                    <Building className="w-8 h-8 mr-3" />
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
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        Atuação:
                      </h4>
                      <ul className="space-y-2">
                        {case_.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span className="text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resultados */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Resultados:
                      </h4>
                      <ul className="space-y-2">
                        {case_.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600 mt-0.5" />
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
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vem ser o nosso próximo case de sucesso!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Entre em contato conosco e descubra como podemos transformar seus processos de RH.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=5511910666444&text=Olá! Gostaria de saber mais sobre como vocês podem ajudar minha empresa."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Fale conosco
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </section>
      </div>
    </div>
  );
};

export default Cases;