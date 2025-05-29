import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
  };
  publishedAt: string;
  modifiedAt?: string;
  url: string;
}

const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  description,
  image,
  author,
  publishedAt,
  modifiedAt,
  url,
}) => {
  const { lang } = useParams();
  const inLanguage = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FIVE Consulting',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`,
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    inLanguage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default BlogPostSchema;