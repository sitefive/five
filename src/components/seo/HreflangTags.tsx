import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';

const supportedLanguages = ['pt', 'en', 'es'];
const defaultLang = 'pt';
const siteUrl = 'https://www.fiveconsulting.com.br';

const HreflangTags = () => {
  const { lang } = useParams();
  const location = useLocation();
  const pathname = location.pathname.replace(/^\/(pt|en|es)/, '');
  
  return (
    <Helmet>
      {supportedLanguages.map((lng) => (
        <link
          key={lng}
          rel="alternate"
          hrefLang={lng}
          href={`${siteUrl}/${lng}${pathname}`}
        />
      ))}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={`${siteUrl}/${defaultLang}${pathname}`} 
      />
    </Helmet>
  );
};

export default HreflangTags;