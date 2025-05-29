import React from 'react';
import ExpertCard from './ExpertCard';

const experts = [
  {
    name: 'Dr. Ricardo Silva',
    role: 'Diretor de Estratégia',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    skills: ['Estratégia', 'Gestão', 'Liderança', 'Inovação'],
    bio: 'Mais de 15 anos de experiência em consultoria estratégica, com passagem por grandes empresas do setor.',
    linkedin: 'https://linkedin.com',
    email: 'ricardo.silva@consultapro.com'
  },
  {
    name: 'Dra. Ana Costa',
    role: 'Especialista em Transformação Digital',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
    skills: ['Digital', 'Tecnologia', 'Processos', 'Inovação'],
    bio: 'Especialista em transformação digital com foco em implementação de novas tecnologias e processos.',
    linkedin: 'https://linkedin.com',
    email: 'ana.costa@consultapro.com'
  },
  {
    name: 'Prof. Carlos Santos',
    role: 'Consultor de Inovação',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    skills: ['Inovação', 'P&D', 'Metodologias Ágeis', 'Design Thinking'],
    bio: 'Professor universitário e consultor com ampla experiência em projetos de inovação empresarial.',
    linkedin: 'https://linkedin.com',
    email: 'carlos.santos@consultapro.com'
  },
  {
    name: 'Dra. Maria Oliveira',
    role: 'Especialista em Desenvolvimento Organizacional',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    skills: ['RH', 'Cultura', 'Liderança', 'Desenvolvimento'],
    bio: 'Especialista em desenvolvimento organizacional e gestão de pessoas com foco em resultados.',
    linkedin: 'https://linkedin.com',
    email: 'maria.oliveira@consultapro.com'
  }
];

const ExpertSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Nossos Especialistas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça nossa equipe de consultores especializados, prontos para 
            transformar seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experts.map((expert, index) => (
            <ExpertCard key={index} {...expert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
