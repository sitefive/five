import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Category } from '../../types/blog';
import { useBlog } from '../../contexts/BlogContext';

const CategoryFilter: React.FC = () => {
  const { state, filterByCategory } = useBlog();
  const { categories, currentCategory } = state;
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => filterByCategory(null)}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
          ${!currentCategory
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {t('blog.allCategories')}
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => filterByCategory(category)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
            ${currentCategory?.id === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;