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

// Supondo que você tenha esses componentes ou queira reativá-los
// import PostReactions from '../components/molecules/PostReactions';
// import ReadingProgress from '../components/molecules/ReadingProgress';
// import RelatedPosts from '../components/molecules/RelatedPosts';
// import Comments from '../components/molecules/Comments';

const PostDetail = () => {
  const { t, i18n } = useTranslation();
  const { slug, lang } = useParams<{ slug: string; lang: string }>();
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
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
      return format(new Date(date), "dd 'de' MMM 'de' yyyy", {
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
        // Busca o post principal
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

        // Busca categorias e posts recentes em paralelo
        const [categoryResult, recentResult] = await Promise.all([
          supabase.from('categories').select(`id, name:name_${langSuffix}, slug:slug_${langSuffix}, posts(count)`),
          supabase.from('posts').select(`id, title:title_${langSuffix}, slug:slug_${langSuffix}`).not('id', 'eq', postData.id).order('published_at', { ascending: false }).limit(3)
        ]);
        
        if (categoryResult.error) throw categoryResult.error;
        setCategories(categoryResult.data || []);
        
        if (recentResult.error) throw recentResult.error;
        setRecentPosts(recentResult.data || []);

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

      {post && (
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
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
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('blog.categories')}</h2>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id} className="text-gray-600">
                      <Link to={`/${lang}/blog/categoria/${cat.slug}`} className="hover:text-blue-500 flex justify-between">
                        <span>{cat.name}</span>
                        {/* ======================= CORREÇÃO FINAL APLICADA AQUI ======================= */}
                        <span>({cat.posts?.[0]?.count || 0})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('blog.recentPosts')}</h2>
                <ul className="space-y-2">
                  {recentPosts.map((p) => (
                    <li key={p.id} className="text-gray-600">
                      <Link to={`/${lang}/blog/${p.slug}`} className="hover:text-blue-500">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;