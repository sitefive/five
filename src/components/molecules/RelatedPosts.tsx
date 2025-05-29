import React from 'react';
import { useTranslation } from 'react-i18next';
import BlogCard from './BlogCard';
import { Post } from '../../types/blog';

interface RelatedPostsProps {
  currentPost: Post;
  posts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost, posts }) => {
  const { t } = useTranslation();

  const relatedPosts = posts
    .filter(post => 
      post.id !== currentPost.id && (
        post.category.id === currentPost.category.id ||
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
    )
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{t('blog.relatedPosts')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;