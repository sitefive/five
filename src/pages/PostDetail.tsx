import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ParallaxHeader from '../components/ParallaxHeader';
import { supabase } from '../lib/supabase';
import ShareButtons from '../components/molecules/ShareButtons';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import BlogPostSchema from '../components/seo/BlogPostSchema';
import PostReactions from '../components/molecules/PostReactions';
import ReadingProgress from '../components/molecules/ReadingProgress';
import { format } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';

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

  const formatPublishDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMM 'de' yyyy", {
      locale: getDateLocale()
    });
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const langSuffix = i18n.language.split('-')[0];
        
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            id,
            title_${langSuffix} as title,
            slug_${langSuffix} as slug,
            excerpt_${langSuffix} as excerpt,
            content_${langSuffix} as content,
            cover_url,
            published_at,
            reading_time,
            featured,
            created_at,
            updated_at,
            author:authors(
              id,
              name_${langSuffix} as name,
              avatar,
              bio_${langSuffix} as bio
            ),
            category:categories(
              id,
              name_${langSuffix} as name,
              slug_${langSuffix} as slug,
              description_${langSuffix} as description
            ),
            post_tags:post_tags(
              tag:tags(
                id,
                name_${langSuffix} as name
              )
            )
          `)
          .eq(`slug_${langSuffix}`, slug)
          .not('published_at', 'is', null)
          .lte('published_at', new Date().toISOString())
          .single();

        if (postError || !postData) {
          throw postError || new Error(t('blog.postNotFound'));
        }

        // Formatar post
        const formattedPost = {
          ...postData,
          tags: postData.post_tags?.map((pt: any) => pt.tag?.name).filter(Boolean) || [],
        };

        setPost(formattedPost);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || t('blog.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, t, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">{error || t('blog.postNotFound')}</h1>
          <Link 
            to={`/${lang}/blog`} 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Blog
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/${lang}/blog/${post.slug}`;

  const breadcrumbItems = [
    { label: t('menu.blog'), href: `/${lang}/blog` },
    post.category && {
      label: post.category.name,
      href: `/${lang}/blog/categoria/${post.category.slug}`,
    },
    { label: post.title, href: `/${lang}/blog/${post.slug}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="pt-0">
      <ReadingProgress />
      <Helmet>
        <title>{post.title} | FIVE Consulting</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.cover_url} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <BlogPostSchema
        title={post.title}
        description={post.excerpt}
        image={post.cover_url}
        author={post.author}
        publishedAt={post.published_at}
        url={canonicalUrl}
      />

      <ParallaxHeader
        title={post.title}
        description={post.excerpt}
        image={post.cover_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80'}
      />

      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
                {post.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author.name}
                  </div>
                )}
                {post.published_at && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatPublishDate(post.published_at)}
                  </div>
                )}
                {post.reading_time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('blog.readingTime', { time: post.reading_time })}
                  </div>
                )}
              </div>

              {post.category && (
                <div className="mb-6">
                  <Link
                    to={`/${lang}/blog/categoria/${post.category.slug}`}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {post.category.name}
                  </Link>
                </div>
              )}

              <div className="mb-6">
                <ShareButtons
                  url={canonicalUrl}
                  title={post.title}
                  description={post.excerpt}
                  postId={post.id}
                />
              </div>

              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags && post.tags.length > 0 && (
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <PostReactions postId={post.id} />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;