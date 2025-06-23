import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import BlogCard from '../components/molecules/BlogCard'; // Supondo que o PostCard se chame BlogCard
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import { Helmet } from 'react-helmet-async';

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

      // 1. Busca a categoria na coluna de slug correta, baseada no idioma da URL
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select(`id, name:name_${lang}, slug:slug_${lang}`)
        .eq(`slug_${lang}`, slug)
        .single();

      if (categoryError || !categoryData) {
        setLoading(false);
        setCategory(null); // Garante que vai mostrar "Categoria não encontrada"
        return;
      }

      setCategory(categoryData);

      // 2. Busca os posts dessa categoria, já com os campos no idioma correto
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          title:title_${lang},
          slug:slug_${lang},
          excerpt:excerpt_${lang},
          cover_url,
          published_at,
          reading_time,
          featured,
          author:authors(id, name:name_${lang}, avatar),
          category:categories(id, name:name_${lang}, slug:slug_${lang}),
          post_tags:post_tags(tag:tags(id, name:name_${lang}))
        `)
        .eq('category_id', categoryData.id)
        .not('published_at', 'is', null) // Garante que só posts publicados apareçam
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
    <div className="pt-20 bg-gray-50 min-h-screen">
       <Helmet>
        <title>{`Categoria: ${category.name}`} - FIVE Consulting</title>
        <meta name="description" content={`Posts na categoria ${category.name}`} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
            {t('blog.category')}: <span className="text-blue-600">{category.name}</span>
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