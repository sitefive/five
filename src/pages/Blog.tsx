import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BlogProvider } from '../contexts/BlogContext';
import BlogHeader from '../components/organisms/BlogHeader';
import BlogGrid from '../components/organisms/BlogGrid';
import ParallaxHeader from '../components/ParallaxHeader';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import CategorySidebar from '../components/organisms/CategorySidebar'; // Importa a nova sidebar

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/${lang}/blog`;

  const breadcrumbItems = [
    { label: t('menu.blog'), href: `/${lang}/blog` }
  ];

  return (
    <BlogProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>{t('blog.title')} - FIVE Consulting</title>
          <meta name="description" content={t('blog.subtitle')} />
          <meta property="og:title" content={`${t('blog.title')} - FIVE Consulting`} />
          <meta property="og:description" content={t('blog.subtitle')} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        <div>
          <ParallaxHeader
            title={t('blog.title')}
            description={t('blog.subtitle')}
            image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
          />

          <div className="container mx-auto px-4 py-12">
            <Breadcrumbs items={breadcrumbItems} />
            
            {/* Novo layout de 2 colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="lg:col-span-1">
                <CategorySidebar />
              </div>
              <div className="lg:col-span-3">
                <BlogHeader />
                <div className="mt-8">
                  <BlogGrid />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogProvider>
  );
};

export default Blog;