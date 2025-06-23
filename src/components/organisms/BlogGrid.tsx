import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import BlogCard from '../molecules/BlogCard';
import Button from '../atoms/Button';
import { useBlog } from '../../contexts/BlogContext';

const BlogGrid: React.FC = () => {
  const { t } = useTranslation();
  const { state, loadMorePosts } = useBlog();
  const { filteredPosts, loading, hasMore, error } = state;

  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  React.useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMorePosts();
    }
  }, [inView, loading, hasMore, loadMorePosts]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erro ao carregar posts
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!loading && filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('blog.noResults')}
        </h3>
        <p className="text-gray-600">
          {t('blog.tryAdjustSearch')}
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </motion.div>

      {hasMore && (
        <div
          ref={ref}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            loading={loading}
            onClick={() => loadMorePosts()}
          >
            {t('blog.loadMore')}
          </Button>
        </div>
      )}
    </>
  );
};

export default BlogGrid;