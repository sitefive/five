import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Post } from '../../types/blog';
import Tag from '../atoms/Tag';

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/${lang}/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9]">
          <img
            src={post.cover_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800&h=400'}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800&h=400';
            }}
          />
          {post.featured && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {t('blog.featured')}
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {post.published_at && formatPublishDate(post.published_at)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {t('blog.readingTime', { time: post.reading_time || 5 })}
          </div>
        </div>

        <Link to={`/${lang}/blog/${post.slug}`} className="block group">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        </Link>

        <div className="flex items-center justify-between">
          {post.author && (
            <div className="flex items-center">
              <img
                src={post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'}
                alt={post.author.name}
                className="w-8 h-8 rounded-full mr-2 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100';
                }}
              />
              <span className="text-sm text-gray-700">
                {post.author.name}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {(post.tags || []).slice(0, 2).map((tag, index) => (
              <Tag key={index} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;