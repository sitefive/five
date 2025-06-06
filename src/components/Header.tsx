import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import logo from '../assets/logo.png'; // Importando corretamente a imagem

const Header = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'pt';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  const services = [
    { 
      key: 'consultoria-especializada', 
      label: t('services.consulting.title'), 
      href: `/${currentLang}/servicos/consultoria-especialista` 
    },
    { 
      key: 'suporte-ams', 
      label: t('services.support.title'), 
      href: `/${currentLang}/servicos/suporte-ams` 
    },
    { 
      key: 'revitalizacao', 
      label: t('services.revitalization.title'), 
      href: `/${currentLang}/servicos/revitalizacao` 
    },
    { 
      key: 'otimizacao', 
      label: t('services.optimization.title'), 
      href: `/${currentLang}/servicos/otimizacao-processos` 
    }
  ];

  const menuItems = [
    { key: 'home', label: t('menu.home'), href: `/${currentLang}/` },
    { key: 'about', label: t('menu.about'), href: `/${currentLang}/#experts`, isAnchor: true },
    { key: 'services', label: t('menu.services'), href: `/${currentLang}/servicos`, hasSubmenu: true, submenu: services },
    { key: 'cases', label: t('menu.cases'), href: `/${currentLang}/#cases`, isAnchor: true },
    { key: 'blog', label: t('menu.blog'), href: `/${currentLang}/blog` },
    { key: 'contact', label: t('menu.contact'), href: `/${currentLang}/contato` },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleMenuClick = (item: any) => {
    if (item.isAnchor) {
      const sectionId = item.href.split('#')[1];
      scrollToSection(sectionId);
    }
  };

  const toggleMobileServices = () => {
    setIsMobileServicesOpen(!isMobileServicesOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-blue-600 shadow-lg backdrop-blur-sm' : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link to={`/${currentLang}`} className="group" onClick={() => window.scrollTo(0, 0)} aria-label={t('menu.home')}>
              <img src={logo} alt="Logo FIVE Consulting" className="h-10 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8" role="navigation">
            {menuItems.map((item) => (
              <div key={item.key} className="relative group">
                {item.hasSubmenu ? (
                  <div
                    className="flex items-center cursor-pointer transition-colors duration-300 font-medium text-white hover:text-gray-200"
                    onMouseEnter={() => setIsServicesMenuOpen(true)}
                    onMouseLeave={() => setIsServicesMenuOpen(false)}
                    role="button"
                    aria-expanded={isServicesMenuOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                    <div 
                      className={`absolute top-full left-0 w-64 py-2 bg-white rounded-lg shadow-lg transform transition-all duration-300 ${
                        isServicesMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      }`}
                      role="menu"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.key}
                          to={subItem.href}
                          className="block px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-gray-600 transition-colors duration-300"
                          onClick={() => handleMenuClick(subItem)}
                          role="menuitem"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`transition-colors duration-300 font-medium text-white hover:text-gray-200`}
                    onClick={() => handleMenuClick(item)}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="relative text-white font-medium px-3 py-2 flex items-center gap-1">
              <LanguageSelector />
            </div>

            <a
              href="https://fiveconsulting.tomticket.com/helpdesk"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-4 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isScrolled
                  ? 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {t('menu.clientArea')}
            </a>
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <button
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-gray-200 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('menu.toggle')}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden bg-blue-600 shadow-lg rounded-b-lg`}
          role="navigation"
        >
          <div className="py-2">
            {menuItems.map((item) => (
              <div key={item.key}>
                {item.hasSubmenu ? (
                  <div className="space-y-1">
                    <button
                      onClick={toggleMobileServices}
                      className="flex items-center justify-between w-full min-h-[44px] px-6 text-white hover:bg-blue-500 transition-colors duration-300 text-lg"
                    >
                      <span>{item.label}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isMobileServicesOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isMobileServicesOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.key}
                          to={subItem.href}
                          className="flex items-center justify-center min-h-[44px] px-8 text-white hover:bg-blue-500 transition-colors duration-300 bg-blue-700"
                          onClick={() => handleMenuClick(subItem)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center justify-center min-h-[44px] px-6 text-white hover:bg-blue-500 transition-colors duration-300 text-lg`}
                    onClick={() => handleMenuClick(item)}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Language Selector Mobile */}
            <div className="px-6 py-3 border-t border-blue-500 mt-2">
              <div className="text-white font-medium mb-2">Idioma:</div>
              <LanguageSelector />
            </div>

            {/* Client Area Mobile */}
            <div className="px-6 py-4">
              <a
                href="https://fiveconsulting.tomticket.com/helpdesk"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {t('menu.clientArea')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;