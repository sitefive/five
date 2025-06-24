import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../../contexts/BlogContext';
import { Category } from '../../types/blog';

const CategorySidebar: React.FC = () => {
  const { t } = useTranslation();
  const { state, filterByCategory } = useBlog();
  const { categories, currentCategory, loading } = state;

  const handleFilter = (category: Category | null) => {
    // Evita re-clicar na mesma categoria
    if (loading || (category?.id === currentCategory?.id && category !== null)) {
      return;
    }
    filterByCategory(category);
  };
  
  const baseButtonStyles = "w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium";
  const activeStyles = "bg-blue-600 text-white";
  const inactiveStyles = "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="bg-white p-6 rounded-xl shadow-lg h-fit sticky top-24">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('blog.categories')}</h3>
      <ul className="space-y-2">
        <li>
            <button 
                onClick={() => handleFilter(null)}
                className={`${baseButtonStyles} ${!currentCategory ? activeStyles : inactiveStyles}`}
                disabled={loading}
            >
                {t('blog.allCategories')}
            </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button 
                onClick={() => handleFilter(cat)}
                className={`${baseButtonStyles} flex justify-between items-center ${currentCategory?.id === cat.id ? activeStyles : inactiveStyles}`}
                disabled={loading}
            >
              <span>{cat.name}</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">{cat.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;