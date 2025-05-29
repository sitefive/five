import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Check, Star, Phone, Mail } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceInfo {
  title: string;
  description: string;
  benefits: string[];
  methodology: {
    title: string;
    steps: string[];
  }[];
  features: string[];
  images: string[];
  testimonials: {
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
  }[];
  faqs: FAQ[];
}

const servicesData: Record<string, ServiceInfo> = {
  'consultoria-estrategica': {
    title: 'Consultoria Estratégica',
    description: 'Nossa consultoria estratégica oferece soluções personalizadas para impulsionar o crescimento sustentável do seu negócio, identificando oportunidades e desenvolvendo planos de ação efetivos.',
    benefits: [
      'Análise completa do mercado e concorrência',
      'Desenvolvimento de planos estratégicos personalizados',
      'Implementação de indicadores de performance (KPIs)',
      'Acompanhamento contínuo de resultados',
      'Otimização de processos decisórios',
      'Redução de custos operacionais'
    ],
    methodology: [
      {
        title: 'Diagnóstico',
        steps: [
          'Análise do cenário atual',
          'Identificação de pontos críticos',
          'Avaliação de processos',
          'Mapeamento de oportunidades'
        ]
      },
      {
        title: 'Planejamento',
        steps: [
          'Definição de objetivos',
          'Elaboração de estratégias',
          'Criação de planos de ação',
          'Estabelecimento de metas'
        ]
      },
      {
        title: 'Implementação',
        steps: [
          'Execução das ações planejadas',
          'Monitoramento de resultados',
          'Ajustes e otimizações',
          'Gestão de mudanças'
        ]
      }
    ],
    features: [
      'Diagnóstico empresarial aprofundado',
      'Planejamento estratégico personalizado',
      'Gestão de projetos e iniciativas',
      'Análise de viabilidade',
      'Mentoria executiva',
      'Workshops de capacitação'
    ],
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'
    ],
    testimonials: [
      {
        name: 'João Silva',
        role: 'CEO',
        company: 'Tech Solutions',
        content: 'A consultoria estratégica transformou completamente nossa visão de negócio e nos ajudou a alcançar resultados extraordinários.',
        rating: 5
      },
      {
        name: 'Maria Santos',
        role: 'Diretora de Operações',
        company: 'Indústrias ABC',
        content: 'O processo de consultoria foi fundamental para identificarmos oportunidades de melhoria e implementarmos mudanças significativas.',
        rating: 5
      }
    ],
    faqs: [
      {
        question: 'Quanto tempo dura o processo de consultoria estratégica?',
        answer: 'O tempo varia de acordo com a complexidade do projeto e as necessidades específicas da sua empresa. Em média, projetos completos podem durar de 3 a 6 meses.'
      },
      {
        question: 'Como é feito o acompanhamento dos resultados?',
        answer: 'Utilizamos um sistema de indicadores de performance (KPIs) personalizado, com reuniões periódicas de acompanhamento e relatórios detalhados de progresso.'
      },
      {
        question: 'Qual o investimento necessário?',
        answer: 'O investimento é personalizado de acordo com o escopo do projeto. Realizamos uma análise inicial gratuita para entender suas necessidades e apresentar uma proposta adequada.'
      }
    ]
  },
  'gestao-processos': {
    title: 'Gestão de Processos',
    description: 'Otimização e automação de processos para maior eficiência operacional, redução de custos e aumento da produtividade.',
    benefits: [
      'Aumento da eficiência operacional',
      'Redução de custos e desperdícios',
      'Padronização de processos',
      'Melhoria da qualidade',
      'Aumento da produtividade',
      'Maior satisfação dos clientes'
    ],
    methodology: [
      {
        title: 'Mapeamento',
        steps: [
          'Identificação de processos críticos',
          'Documentação de fluxos atuais',
          'Análise de gargalos',
          'Levantamento de indicadores'
        ]
      },
      {
        title: 'Otimização',
        steps: [
          'Redesenho de processos',
          'Eliminação de desperdícios',
          'Automação de atividades',
          'Definição de controles'
        ]
      },
      {
        title: 'Implementação',
        steps: [
          'Treinamento das equipes',
          'Implantação de melhorias',
          'Monitoramento de resultados',
          'Melhoria contínua'
        ]
      }
    ],
    features: [
      'Mapeamento de processos',
      'Análise de eficiência',
      'Automação de rotinas',
      'Gestão da qualidade',
      'Indicadores de desempenho',
      'Documentação de procedimentos'
    ],
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80'
    ],
    testimonials: [
      {
        name: 'Pedro Oliveira',
        role: 'Diretor Industrial',
        company: 'Manufatura XYZ',
        content: 'A otimização dos nossos processos resultou em uma redução de 30% nos custos operacionais e aumento significativo da produtividade.',
        rating: 5
      }
    ],
    faqs: [
      {
        question: 'Como identificar quais processos precisam ser otimizados?',
        answer: 'Realizamos uma análise inicial completa dos processos, identificando pontos críticos, gargalos e oportunidades de melhoria através de metodologias específicas.'
      },
      {
        question: 'Quanto tempo leva para ver resultados?',
        answer: 'Os primeiros resultados podem ser observados em 30-60 dias, com melhorias contínuas ao longo do projeto.'
      }
    ]
  },
  'transformacao-digital': {
    title: 'Transformação Digital',
    description: 'Modernize sua empresa através da implementação estratégica de tecnologias digitais, otimizando processos e melhorando a experiência do cliente.',
    benefits: [
      'Aumento da eficiência operacional',
      'Melhor experiência do cliente',
      'Redução de custos operacionais',
      'Tomada de decisão baseada em dados',
      'Maior agilidade nos processos',
      'Vantagem competitiva no mercado'
    ],
    methodology: [
      {
        title: 'Avaliação Digital',
        steps: [
          'Análise da maturidade digital',
          'Identificação de oportunidades',
          'Mapeamento de tecnologias',
          'Avaliação de infraestrutura'
        ]
      },
      {
        title: 'Estratégia',
        steps: [
          'Definição de prioridades',
          'Roadmap de transformação',
          'Planejamento de recursos',
          'Gestão de mudanças'
        ]
      },
      {
        title: 'Implementação',
        steps: [
          'Desenvolvimento de soluções',
          'Integração de sistemas',
          'Treinamento de equipes',
          'Monitoramento de resultados'
        ]
      }
    ],
    features: [
      'Automação de processos',
      'Análise de dados avançada',
      'Integração de sistemas',
      'Cloud computing',
      'Cibersegurança',
      'Inovação digital'
    ],
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80'
    ],
    testimonials: [
      {
        name: 'Roberto Almeida',
        role: 'CTO',
        company: 'Digital Solutions',
        content: 'A transformação digital implementada revolucionou nossa forma de trabalhar, aumentando significativamente nossa produtividade.',
        rating: 5
      }
    ],
    faqs: [
      {
        question: 'Quanto tempo leva para implementar a transformação digital?',
        answer: 'O tempo de implementação varia conforme o escopo e complexidade do projeto. Geralmente, as primeiras mudanças são visíveis em 3-4 meses.'
      },
      {
        question: 'Como garantir a segurança dos dados durante a transformação?',
        answer: 'Implementamos protocolos rigorosos de segurança e seguimos as melhores práticas de proteção de dados em todas as etapas do processo.'
      }
    ]
  },
  'desenvolvimento-organizacional': {
    title: 'Desenvolvimento Organizacional',
    description: 'Potencialize o capital humano da sua empresa através de programas de desenvolvimento que promovem a excelência organizacional e o crescimento sustentável.',
    benefits: [
      'Maior engajamento dos colaboradores',
      'Cultura organizacional fortalecida',
      'Liderança mais efetiva',
      'Melhor clima organizacional',
      'Redução de turnover',
      'Aumento da produtividade'
    ],
    methodology: [
      {
        title: 'Diagnóstico',
        steps: [
          'Análise de clima organizacional',
          'Avaliação de competências',
          'Mapeamento de cultura',
          'Identificação de gaps'
        ]
      },
      {
        title: 'Desenvolvimento',
        steps: [
          'Programas de capacitação',
          'Coaching executivo',
          'Gestão de talentos',
          'Desenvolvimento de líderes'
        ]
      },
      {
        title: 'Acompanhamento',
        steps: [
          'Avaliação de resultados',
          'Feedback contínuo',
          'Ajustes de programa',
          'Mentorias individuais'
        ]
      }
    ],
    features: [
      'Programas de liderança',
      'Gestão de mudanças',
      'Desenvolvimento de equipes',
      'Cultura organizacional',
      'Avaliação de desempenho',
      'Planos de carreira'
    ],
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80'
    ],
    testimonials: [
      {
        name: 'Ana Paula Santos',
        role: 'Diretora de RH',
        company: 'Grupo Inovação',
        content: 'O programa de desenvolvimento organizacional transformou nossa cultura empresarial e melhorou significativamente o engajamento das equipes.',
        rating: 5
      }
    ],
    faqs: [
      {
        question: 'Como medir os resultados do desenvolvimento organizacional?',
        answer: 'Utilizamos indicadores específicos como engajamento, turnover, clima organizacional e produtividade, além de pesquisas regulares com colaboradores.'
      },
      {
        question: 'Qual a duração média dos programas de desenvolvimento?',
        answer: 'Os programas são customizados de acordo com as necessidades da empresa, mas geralmente têm duração de 6 a 12 meses para resultados consistentes.'
      }
    ]
  }
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return <div>Serviço não encontrado</div>;
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {service.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Nossa Metodologia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.methodology.map((phase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{phase.title}</h3>
                <ul className="space-y-3">
                  {phase.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-blue-600" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Image Gallery */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Galeria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={image}
                  alt={`${service.title} - Imagem ${index + 1}`}
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Depoimentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.role} - {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {service.faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-50 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Solicite uma Proposta</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Descreva sua necessidade"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                >
                  Enviar Mensagem
                  <ArrowRight className="ml-2" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">Fale Conosco</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-gray-600">+55 (11) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contato@consultapro.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceDetail;