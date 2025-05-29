import React from 'react';
import { Users2, Target, Award } from 'lucide-react';
import ParallaxHeader from '../components/ParallaxHeader';

const About = () => {
  const scrollToExperts = () => {
    const element = document.getElementById('experts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#experts';
    }
  };

  return (
    <div className="pt-00">
      <ParallaxHeader
        title="Sobre Nós"
        description="Somos especialistas em transformar desafios em oportunidades, impulsionando o crescimento sustentável de empresas através de consultoria estratégica e soluções inovadoras."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-106">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <Users2 className="w-12 h-12 text-blue-600 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold mb-2">Nossa Equipe</h3>
            <p className="text-gray-600">
              Profissionais altamente qualificados com vasta experiência em 
              diferentes setores do mercado.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <Target className="w-12 h-12 text-blue-600 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold mb-2">Nossa Missão</h3>
            <p className="text-gray-600">
              Impulsionar o sucesso dos nossos clientes através de soluções 
              estratégicas e inovadoras.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <Award className="w-12 h-12 text-blue-600 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold mb-2">Nossos Valores</h3>
            <p className="text-gray-600">
              Excelência, inovação, ética e compromisso com resultados 
              sustentáveis.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
          <p className="text-gray-600 mb-8">
            Há mais de uma década, iniciamos nossa jornada com um propósito claro: 
            transformar o mercado de consultoria empresarial. Desde então, temos 
            ajudado empresas a alcançarem seu máximo potencial através de 
            estratégias personalizadas e soluções inovadoras.
          </p>
          <button 
            onClick={scrollToExperts}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Conheça Nossa Equipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;