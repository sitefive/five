import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard'; // reutilize o mesmo componente da home se quiser

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      setLoading(true);
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError) {
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          author:authors(*),
          category:categories(*),
          post_tags:post_tags(
            tag:tags(*)
          )
        `)
        .eq('category_id', categoryData.id)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      const formattedPosts = postsData.map((post: any) => ({
        ...post,
        tags: post.post_tags?.map((pt: any) => pt.tag.name) || [],
      }));

      setPosts(formattedPosts);
      setLoading(false);
    };

    fetchCategoryAndPosts();
  }, [slug]);

  if (loading) return <div className="pt-20 text-center">Carregando...</div>;
  if (!category) return <div className="pt-20 text-center">Categoria não encontrada</div>;

  return (
    <div className="pt-20 container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Categoria: {category.name}</h1>
      {posts.length === 0 ? (
        <p>Nenhum post encontrado nessa categoria.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
