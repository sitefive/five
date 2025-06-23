import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Clock, Calendar, User } from 'lucide-react';
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
    if (!date) return '';
    return format(new Date(date), "dd 'de' MMM 'de' yyyy", {
      locale: getDateLocale()
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/${lang}/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9]">
          <img
            src={post.cover_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80'}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {post.featured && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {t('blog.featured')}
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
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

        <Link to={`/${lang}/blog/${post.slug}`} className="block group flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          {post.author && (
            <div className="flex items-center group"> {/* Removido o Link aqui para simplificar */}
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <span className="text-sm text-gray-700">
                {post.author.name}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {(post.tags || []).slice(0, 2).map((tag: string) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;