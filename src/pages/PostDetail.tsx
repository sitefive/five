import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import ParallaxHeader from '../components/ParallaxHeader';
import ShareButtons from '../components/molecules/ShareButtons';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import BlogPostSchema from '../components/seo/BlogPostSchema';
import Button from '../components/atoms/Button'; // <<<<====== LINHA ADICIONADA AQUI

// Supondo que você tenha esses componentes ou queira reativá-los
// import PostReactions from '../components/molecules/PostReactions';
// import ReadingProgress from '../components/molecules/ReadingProgress';
// import RelatedPosts from '../components/molecules/RelatedPosts';
// import Comments from '../components/molecules/Comments';

const PostDetail = () => {
  const { t, i18n } = useTranslation();
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt': return ptBR;
      case 'es': return es;
      default: return undefined;
    }
  };

  const formatPublishDate = (date: string | null) => {
    if (!date) return '';
    try {
      return format(new Date(date), "dd 'de' MMM 'de'<x_bin_389>", {
        locale: getDateLocale()
      });
    } catch {
      return 'Data inválida';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !lang) {
        setError(t('blog.postNotFound'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            author:authors(*),
            category:categories(*),
            post_tags:post_tags(tag:tags(*))
          `)
          .eq(`slug_${lang}`, slug)
          .single();

        if (postError || !postData) {
          throw postError || new Error(t('blog.postNotFound'));
        }

        const langSuffix = lang.split('-')[0];

        const formattedPost = {
            ...postData,
            title: postData[`title_${langSuffix}`] || '',
            content: postData[`content_${langSuffix}`] || '',
            excerpt: postData[`excerpt_${langSuffix}`] || '',
            slug: postData[`slug_${langSuffix}`] || '',
            tags: postData.post_tags?.map((pt: any) => pt.tag?.[`name_${langSuffix}`])?.filter(Boolean) || [],
            author: postData.author ? {
                ...postData.author,
                name: postData.author[`name_${langSuffix}`]
            } : null,
            category: postData.category ? {
                ...postData.category,
                name: postData.category[`name_${langSuffix}`],
                slug: postData.category[`slug_${langSuffix}`]
            } : null
        };
        setPost(formattedPost);

      } catch (err: any) {
        console.error("Error fetching post details:", err);
        setError(err.message || t('blog.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, lang, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-semibold">{error}</h1>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/${lang}/blog/${post?.slug}`;

  const breadcrumbItems = [
    { label: t('menu.blog'), href: `/${lang}/blog` },
    post.category && {
      label: post.category.name,
      href: `/${lang}/blog/categoria/${post.category.slug}`,
    },
    { label: post.title || '', href: `/${lang}/blog/${post?.slug}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div>
      <Helmet>
        <title>{post.title} | FIVE Consulting</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.cover_url} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {post.author && (
        <BlogPostSchema
          title={post.title}
          description={post.excerpt}
          image={post.cover_url}
          author={post.author}
          publishedAt={post.published_at}
          url={canonicalUrl}
        />
      )}

      <ParallaxHeader
        title={post.title || ''}
        description={post.excerpt}
        image={post.cover_url}
      />

      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <article className="p-6 md:p-8">
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-4">
                {post.author?.name && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    {post.author.name}
                  </div>
                )}
                {post.published_at && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {formatPublishDate(post.published_at)}
                  </div>
                )}
                {post.reading_time && (
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {t('blog.readingTime', { time: post.reading_time })}
                    </div>
                )}
              </div>
              
              <div className="mt-6 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
              
              <ShareButtons
                  url={canonicalUrl}
                  title={post.title}
                  description={post.excerpt}
                />
            </article>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;