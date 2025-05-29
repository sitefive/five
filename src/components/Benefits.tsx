import React from 'react';
import { Lightbulb, BarChart, Rocket, Users } from 'lucide-react';

const benefits = [
  {
    icon: <Lightbulb className="w-12 h-12 text-blue-600" />,
    title: 'Soluções Personalizadas',
    description: 'Estratégias sob medida para atender às necessidades específicas do seu negócio.'
  },
  {
    icon: <BarChart className="w-12 h-12 text-blue-600" />,
    title: 'Transformação Digital',
    description: 'Automação de processos e implementação de tecnologias inovadoras.'
  },
  {
    icon: <Users className="w-12 h-12 text-blue-600" />,
    title: 'Expertise Reconhecida',
    description: 'Equipe de consultores especializados com vasta experiência no mercado.'
  },
  {
    icon: <Rocket className="w-12 h-12 text-blue-600" />,
    title: 'Resultados Mensuráveis',
    description: 'Acompanhamento detalhado e resultados sustentáveis para seu negócio.'
  }
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Por que escolher nossa consultoria?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 transform hover:scale-110 transition-transform duration-300 flex justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;