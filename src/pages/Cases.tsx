import React from 'react';
import { ArrowRight } from 'lucide-react';
import ParallaxHeader from '../components/ParallaxHeader';

const cases = [
  {
    company: 'TechCorp Solutions',
    industry: 'Tecnologia',
    challenge: 'Transformação Digital',
    result: '150% de aumento em eficiência operacional',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80'
  },
  {
    company: 'Global Retail',
    industry: 'Varejo',
    challenge: 'Otimização de Processos',
    result: '35% de redução em custos operacionais',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80'
  },
  {
    company: 'FinanceMax',
    industry: 'Financeiro',
    challenge: 'Gestão Estratégica',
    result: '200% de crescimento em 18 meses',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80'
  }
];

const Cases = () => {
  return (
    <div className="pt-00">
      <ParallaxHeader
        title="Cases de Sucesso"
        description="Conheça as histórias de transformação e sucesso dos nossos clientes."
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((case_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${case_.image})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{case_.company}</h3>
                <p className="text-gray-600 mb-4">
                  <strong>Setor:</strong> {case_.industry}<br />
                  <strong>Desafio:</strong> {case_.challenge}<br />
                  <strong>Resultado:</strong> {case_.result}
                </p>
                <button className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300">
                  Ver case completo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cases;