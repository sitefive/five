import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../../contexts/BlogContext';
import CategoryFilter from '../molecules/CategoryFilter';

const BlogHeader: React.FC = () => {
  const { t } = useTranslation();
  const { state, searchPosts } = useBlog();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchValue(value);
      
      // Debounce search
      const timeoutId = setTimeout(() => {
        searchPosts(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [searchPosts]
  );

  const getResultsText = () => {
    const count = state.filteredPosts.length;
    
    if (state.currentCategory && state.searchQuery) {
      return t('blog.showingResultsWithCategoryAndSearch', {
        count,
        category: state.currentCategory.name,
        query: state.searchQuery
      });
    }
    if (state.currentCategory) {
      return t('blog.showingResultsInCategory', {
        count,
        category: state.currentCategory.name
      });
    }
    if (state.searchQuery) {
      return t('blog.showingResultsWithSearch', {
        count,
        query: state.searchQuery
      });
    }
    return t('blog.showingResults', { count });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <input
          type="text"
          placeholder={t('blog.search')}
          value={searchValue}
          onChange={handleSearch}
          className="w-full px-4 py-3 pl-12 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CategoryFilter />
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-gray-600">{getResultsText()}</p>
        {state.loading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Carregando...
          </div>
        )}
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default BlogHeader;