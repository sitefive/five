import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BreadcrumbSchema from '../seo/BreadcrumbSchema';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const baseUrl = window.location.origin;

  const schemaItems = [
    { name: t('common.home'), item: `${baseUrl}/${lang}` },
    ...items.map(item => ({
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  ];
  
  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to={`/${lang}`} className="text-gray-500 hover:text-gray-700">
              {t('common.home')}
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              {index === items.length - 1 ? (
                <span className="text-gray-700" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;