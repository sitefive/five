import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR, es } from 'date-fns/locale';
import Tag from './atoms/Tag';
import { Post } from '../types/blog';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.cover_url && ( // PADRONIZADO AQUI
        <Link to={`/${lang}/blog/${post.slug}`}>
          <img
            src={post.cover_url} // PADRONIZADO AQUI
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {(post.tags || []).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <Link to={`/${lang}/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center">
          {post.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <div>
            <p className="font-medium">{post.author?.name}</p>
            <p className="text-sm text-gray-500">
              {post.published_at && formatPublishDate(post.published_at)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;