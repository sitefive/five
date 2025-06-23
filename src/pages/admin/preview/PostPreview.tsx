import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';

const PostPreview = () => {
  const { t, i18n } = useTranslation('admin');
  const { id } = useParams<{ id: string }>();
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
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            author:authors(*),
            category:categories(*),
            post_tags:post_tags(tag:tags(*))
          `)
          .eq('id', id)
          .single();

        if (postError || !postData) throw postError || new Error('Post não encontrado');

        // Format post data based on current language
        const formattedPost = {
          ...postData,
          title: postData[`title_${i18n.language}`] || postData.title_pt || postData.title,
          slug: postData[`slug_${i18n.language}`] || postData.slug_pt || postData.slug,
          excerpt: postData[`excerpt_${i18n.language}`] || postData.excerpt_pt || postData.excerpt,
          content: postData[`content_${i18n.language}`] || postData.content_pt || postData.content,
          cover_url: postData.cover_url, // <<== CORRIGIDO AQUI
          author: {
            ...postData.author,
            name: postData.author?.[`name_${i18n.language}`] || postData.author?.name_pt || postData.author?.name,
            bio: postData.author?.[`bio_${i18n.language}`] || postData.author?.bio_pt || postData.author?.bio
          },
          category: {
            ...postData.category,
            name: postData.category?.[`name_${i18n.language}`] || postData.category?.name_pt || postData.category?.name,
            slug: postData.category?.[`slug_${i18n.language}`] || postData.category?.slug_pt || postData.category?.slug
          },
          tags: postData.post_tags?.map((pt: any) => pt.tag?.[`name_${i18n.language}`] || pt.tag?.name_pt || pt.tag?.name) || [],
        };

        setPost(formattedPost);
      } catch (err) {
        setError('Erro ao carregar o post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando preview...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">{error || 'Post não encontrado'}</h1>
          <Link 
            to="/admin/posts" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Preview: {post.title} | FIVE Consulting</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Preview Header */}
      <div className="bg-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-medium mr-3">
              PREVIEW
            </span>
            <span className="text-sm">Visualização do post - não indexado pelo Google</span>
          </div>
          <Link 
            to="/admin/posts" 
            className="inline-flex items-center text-white hover:text-gray-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Admin
          </Link>
        </div>
      </div>

      {/* Post Header */}
      <div className="relative min-h-[400px] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${post.cover_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80'})`, // <<== CORRIGIDO AQUI
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'grayscale(100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-90" />
        </div>

        <div className="container mx-auto px-4 z-10 mt-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-blue-100 max-w-2xl">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="container mx-auto px-4 py-16">
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
                {post.created_at && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatPublishDate(post.created_at)}
                  </div>
                )}
                {post.reading_time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.reading_time} min de leitura
                  </div>
                )}
              </div>

              {post.category && (
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category.name}
                  </span>
                </div>
              )}

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;