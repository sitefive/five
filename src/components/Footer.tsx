import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Newsletter from './Newsletter';

const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{t('footer.about')}</h3>
            <p className="text-gray-400">
              {t('footer.aboutText')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to={`/${lang}/#experts`} className="hover:text-white transition-colors duration-300">
                  {t('menu.about')}
                </Link>
              </li>
              <li>
                <Link to={`/${lang}/#Solutions`} className="hover:text-white transition-colors duration-300">
                  {t('menu.services')}
                </Link>
              </li>
              <li>
                <Link to={`/${lang}/#cases`} className="hover:text-white transition-colors duration-300">
                  {t('menu.cases')}
                </Link>
              </li>
              <li>
                <Link to={`/${lang}/blog`} className="hover:text-white transition-colors duration-300">
                  {t('menu.blog')}
                </Link>
              </li>
              <li>
                <Link to={`/${lang}/contato`} className="hover:text-white transition-colors duration-300">
                  {t('menu.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-500" />
                <span>(11) 91066-6444</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <span>contato@fiveconsulting.com.br</span>
              </li>
              <li className="flex space-x-4 pt-2">
                <a
                  href="https://www.linkedin.com/company/fiveconsultoria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 text-blue-500"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/fiveconsulting_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300 text-blue-500"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{t('footer.newsletter')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.newsletterText')}
            </p>
            <Newsletter />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>{t('footer.rights')}</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to={`/${lang}/privacy-policy`} className="hover:text-white transition-colors duration-300">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to={`/${lang}/terms-of-use`} className="hover:text-white transition-colors duration-300">
                {t('footer.termsOfUse')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;