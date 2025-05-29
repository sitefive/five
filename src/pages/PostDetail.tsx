import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ParallaxHeader from '../components/ParallaxHeader';
import { supabase } from '../lib/supabase';
import ShareButtons from '../components/molecules/ShareButtons';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import BlogPostSchema from '../components/seo/BlogPostSchema';
import PostReactions from '../components/molecules/PostReactions';
import ReadingProgress from '../components/molecules/ReadingProgress';
import RelatedPosts from '../components/molecules/RelatedPosts';
import Comments from '../components/molecules/Comments';
import { format } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';

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

  const formatPublishDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMM 'de' yyyy", {
      locale: getDateLocale()
    });
  };

  useEffect(() => {
    const fetchData = async () => {
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
          .eq('slug', slug)
          .single();

        if (postError || !postData) throw postError || new Error(t('blog.postNotFound'));

        setPost({
          ...postData,
          tags: postData.post_tags?.map((pt: any) => pt.tag.name) || [],
        });

        const { data: categoryData } = await supabase
          .from('categories')
          .select('id, name, slug, posts(count)')
          .order('name', { ascending: true });

        const formattedCategories = categoryData?.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat.posts?.length || 0,
        })) || [];

        setCategories(formattedCategories);

        const { data: recent } = await supabase
          .from('posts')
          .select('id, title, slug')
          .order('published_at', { ascending: false })
          .limit(3);

        setRecentPosts(recent || []);
      } catch (err) {
        setError(t('blog.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, t, i18n.language]);

  if (loading) {
    return (
      <div className="pt-20 text-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-20 text-center">
        <h1 className="text-2xl font-semibold">{error || t('blog.postNotFound')}</h1>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/${lang}/blog/${post?.slug}`;

  const breadcrumbItems = [
    { label: t('menu.blog'), href: `/${lang}/blog` },
    post?.category && {
      label: post.category.name,
      href: `/${lang}/blog/categoria/${post.category.slug}`,
    },
    { label: post?.title || '', href: `/${lang}/blog/${post?.slug}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="pt-00">
      <ReadingProgress />
      <Helmet>
        <title>{post?.title} | FIVE Consulting</title>
        <meta name="description" content={post?.excerpt} />
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={post?.excerpt} />
        <meta property="og:image" content={post?.cover_image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {post && (
        <BlogPostSchema
          title={post.title}
          description={post.excerpt}
          image={post.cover_image}
          author={post.author}
          publishedAt={post.published_at}
          url={canonicalUrl}
        />
      )}

      <ParallaxHeader
        title={post?.title || ''}
        description={post?.excerpt}
        image={post?.cover_image}
      />

      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author?.name || post.author?.username || t('blog.author')}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatPublishDate(post.published_at)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('blog.readingTime', { time: post.reading_time || '—' })}
                  </div>
                </div>

                <ShareButtons
                  url={canonicalUrl}
                  title={post.title}
                  description={post.excerpt}
                />

                <div className="mt-6 prose prose-lg max-w-none">
                  {post.content}
                </div>
                
                <PostReactions postId={post.id} />
                <Comments postId={post.id} comments={post.comments} />
              </div>
            </article>

            <RelatedPosts currentPost={post} posts={relatedPosts} />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t('blog.search')}</h2>
              <input
                type="text"
                placeholder={t('blog.search')}
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('blog.categories')}</h2>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id} className="text-gray-600">
                      <Link to={`/${lang}/blog/categoria/${cat.slug}`} className="hover:text-blue-500">
                        {cat.name} ({cat.count})
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;