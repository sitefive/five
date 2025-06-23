import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import BlogCard from '../components/molecules/BlogCard';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import { Helmet } from 'react-helmet-async';
import ParallaxHeader from '../components/ParallaxHeader'; // Importação adicionada

const CategoryPage = () => {
  const { slug, lang } = useParams<{ slug: string, lang: string }>();
  const { t } = useTranslation();
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      if (!slug || !lang) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const langSuffix = lang.split('-')[0];

      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select(`id, name:name_${langSuffix}, slug:slug_${langSuffix}`)
        .eq(`slug_${langSuffix}`, slug)
        .single();

      if (categoryError || !categoryData) {
        setLoading(false);
        setCategory(null);
        return;
      }

      setCategory(categoryData);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          title:title_${langSuffix},
          slug:slug_${langSuffix},
          excerpt:excerpt_${langSuffix},
          cover_url,
          published_at,
          reading_time,
          featured,
          author:authors(id, name:name_${langSuffix}, avatar),
          category:categories(id, name:name_${langSuffix}, slug:slug_${langSuffix}),
          post_tags:post_tags(tag:tags(id, name:name_${langSuffix}))
        `)
        .eq('category_id', categoryData.id)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      if (postsError) {
          console.error("Erro ao buscar posts da categoria:", postsError);
          setLoading(false);
          return;
      }

      const formattedPosts = (postsData || []).map((post: any) => ({
        ...post,
        tags: post.post_tags?.map((pt: any) => pt.tag.name) || [],
      }));

      setPosts(formattedPosts);
      setLoading(false);
    };

    fetchCategoryAndPosts();
  }, [slug, lang]);
  
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/${lang}/blog/categoria/${slug}`;
  const breadcrumbItems = [
    { label: t('menu.blog'), href: `/${lang}/blog` },
    { label: category?.name || slug, href: `/${lang}/blog/categoria/${slug}` }
  ];

  if (loading) return <div className="min-h-screen pt-20 text-center">Carregando...</div>;
  if (!category) return <div className="min-h-screen pt-20 text-center">Categoria não encontrada</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
       <Helmet>
        <title>{`Categoria: ${category.name}`} - FIVE Consulting</title>
        <meta name="description" content={`Posts na categoria ${category.name}`} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      
      {/* Cabeçalho da página adicionado */}
      <ParallaxHeader
        title={`Categoria: ${category.name}`}
        description={t('blog.showingCategoryPosts')} // Crie esta chave de tradução ou substitua por um texto
        image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
            {/* Texto de tradução corrigido */}
            Categoria: <span className="text-blue-600">{category.name}</span>
        </h1>
        {posts.length === 0 ? (
          <p>Nenhum post encontrado nessa categoria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;