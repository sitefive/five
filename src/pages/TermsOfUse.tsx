import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

const TermsOfUse = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-300 min-h-screen">
        <Helmet>
          <title>Termos de Uso | FIVE Consulting</title>
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 py-32">
          <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
          <p className="mb-4 text-gray-800">
            Ao acessar este site, você concorda com os termos e condições abaixo. Recomendamos a leitura cuidadosa antes de navegar.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Uso do conteúdo</h2>
          <p className="mb-4 text-gray-800">
            O conteúdo deste site é de propriedade da FIVE Consulting e protegido por direitos autorais. É proibida a reprodução sem autorização prévia.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Responsabilidades do usuário</h2>
          <p className="mb-4 text-gray-800">
            Você se compromete a utilizar este site de forma lícita, respeitosa e que não infrinja direitos de terceiros ou da empresa.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Links externos</h2>
          <p className="mb-4 text-gray-800">
            Este site pode conter links para páginas externas. A FIVE Consulting não se responsabiliza pelo conteúdo ou políticas desses sites.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Modificações</h2>
          <p className="mb-4 text-gray-800">
            Reservamo-nos o direito de alterar os termos de uso a qualquer momento. Recomendamos revisitar esta página periodicamente.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitação de responsabilidade</h2>
          <p className="mb-4 text-gray-800">
            A FIVE Consulting não se responsabiliza por danos decorrentes do uso ou da impossibilidade de uso do site, mesmo que avisada da possibilidade desses danos.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Legislação aplicável</h2>
          <p className="mb-4 text-gray-800">
            Este site é regido pelas leis brasileiras. Qualquer disputa será submetida ao foro da comarca de São Paulo - SP.
          </p>

          <p className="mt-8 text-gray-600 text-sm">Última atualização: Maio de 2025</p>
        </div>
      </div>
      <Footer />
      <CookieConsent />
    </>
  );
};

export default TermsOfUse;