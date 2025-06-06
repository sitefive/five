import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ParallaxHeader from '../components/ParallaxHeader';

const ConsultoriaEspecialista = () => {
  const { t } = useTranslation();

  const benefits = [
    'Diagnóstico aprofundado do cenário atual',
    'Soluções sob medida para sua realidade',
    'Maior eficiência na gestão de pessoas',
    'Redução de retrabalho e falhas operacionais',
    'Equipe mais capacitada e engajada',
    'Apoio estratégico à tomada de decisão'
  ];

  const methodology = [
    {
      title: 'Diagnóstico',
      steps: [
        'Entendimento do negócio e desafios',
        'Análise dos processos atuais',
        'Identificação de pontos críticos',
        'Avaliação da maturidade do sistema'
      ]
    },
    {
      title: 'Planejamento',
      steps: [
        'Definição dos objetivos e metas',
        'Elaboração do plano de ação',
        'Alinhamento com as lideranças',
        'Cronograma de entregas e recursos'
      ]
    },
    {
      title: 'Implementação',
      steps: [
        'Parametrizações no sistema',
        'Apoio técnico e funcional',
        'Validação junto aos usuários',
        'Gestão da mudança'
      ]
    },
    {
      title: 'Acompanhamento',
      steps: [
        'Avaliação dos resultados',
        'Suporte pós-implantação',
        'Recomendações de melhoria contínua',
        'Relatórios executivos'
      ]
    }
  ];

  return (
    <div className="pt-00">
      <ParallaxHeader
        title="Consultoria Especialista"
        description="Soluções personalizadas em sistemas de RH, com foco estratégico, alinhadas às necessidades do negócio e à maturidade da sua operação."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
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
          <h2 className="text-3xl font-bold mb-8">Nossa Metodologia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((phase, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">
                  {phase.title}
                </h3>
                <ul className="space-y-4">
                  {phase.steps.map((step, stepIndex) => (
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
              href="https://api.whatsapp.com/send/?phone=5511910666444&text=Olá! Gostaria de saber mais sobre a consultoria especialista."
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

export default ConsultoriaEspecialista;