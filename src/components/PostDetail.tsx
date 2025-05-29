import React, { useState } from 'react';
import { Calendar, Clock, User, Search } from 'lucide-react';
import Sidebar from './Sidebar';

// Simulando alguns posts
const posts = [
  {
    title: 'O Futuro da Transformação Digital nas Empresas',
    excerpt: 'Descubra as principais tendências e como se preparar para as mudanças tecnológicas.',
    author: 'Maria Silva',
    date: '15 Mar 2024',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    content: 'Conteúdo completo sobre transformação digital...',
    views: 120,
    category: 'Transformação Digital',
    link: '/blog/o-futuro-da-transformacao-digital-nas-empresas',
  },
  // Adicione mais posts aqui conforme necessário
];

const PostDetail = ({ match }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const post = posts.find((p) => p.link === match.url); // Encontrar o post baseado no URL

  if (!post) return <div>Post não encontrado.</div>;

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Insights, análises e tendências do mundo dos negócios.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex gap-8">
        {/* Sidebar */}
        <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Conteúdo da Postagem */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div
              className="h-96 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
              </div>
              <p className="text-lg text-gray-600 mt-6">{post.excerpt}</p>

              {/* Conteúdo completo */}
              <div className="mt-8">
                <p>{post.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
