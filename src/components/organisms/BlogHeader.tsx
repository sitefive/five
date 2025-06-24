import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../../contexts/BlogContext';

const BlogHeader: React.FC = () => {
  const { t } = useTranslation();
  const { state, searchPosts } = useBlog();
  const [searchValue, setSearchValue] = useState(state.searchQuery);

  // Debounce para a busca
  useEffect(() => {
    const handler = setTimeout(() => {
        if (searchValue !== state.searchQuery) {
            searchPosts(searchValue);
        }
    }, 300); // 300ms de delay para não buscar a cada letra

    return () => clearTimeout(handler);
  }, [searchValue, searchPosts, state.searchQuery]);


  const getResultsText = () => {
    const { total, currentCategory, searchQuery } = state;
    if (loading) return t('common.loading');
    
    // Lógica para mostrar o texto de resultados...
    return t('blog.showingResults', { count: total || 0 });
  };
  const { loading } = state;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <input
          type="text"
          placeholder={t('blog.search')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">{getResultsText()}</p>
      </div>
    </div>
  );
};

export default BlogHeader;