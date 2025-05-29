import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Search, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  title: string;
  path: string;
  type: 'page' | 'post' | 'service';
}

interface SearchBarProps {
  className?: string;
}

// Dados simulados para demonstração
const searchData: SearchResult[] = [
  { title: 'Consultoria Estratégica', path: '/servicos/consultoria-estrategica', type: 'service' },
  { title: 'Transformação Digital', path: '/servicos/transformacao-digital', type: 'service' },
  { title: 'Gestão de Processos', path: '/servicos/gestao-processos', type: 'service' },
  { title: 'Desenvolvimento Organizacional', path: '/servicos/desenvolvimento-organizacional', type: 'service' },
  { title: 'Cases de Sucesso', path: '/cases', type: 'page' },
  { title: 'Blog', path: '/blog', type: 'page' },
  { title: 'Sobre Nós', path: '/sobre', type: 'page' },
  { title: 'Contato', path: '/contato', type: 'page' },
];

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Carregar buscas recentes do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Salvar busca no histórico
  const saveToRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsActive(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (searchTerm) {
      timeoutId = setTimeout(() => {
        const filtered = searchData
          .filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 10);
        setResults(filtered);
      }, 300);
    } else {
      setResults([]);
    }

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (path: string, term: string) => {
    saveToRecent(term);
    setSearchTerm('');
    setIsActive(false);
    setSelectedIndex(-1);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex > -1 && results[selectedIndex]) {
        handleSearch(results[selectedIndex].path, results[selectedIndex].title);
      } else if (results.length > 0) {
        handleSearch(results[0].path, results[0].title);
      }
    } else if (e.key === 'Escape') {
      setIsActive(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Serviço';
      case 'page': return 'Página';
      case 'post': return 'Artigo';
      default: return type;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsActive(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar..."
          className="w-full h-[44px] px-4 py-2 pl-12 pr-10 rounded-lg bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-base"
          aria-label="Campo de busca"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Limpar busca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isActive && (results.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={index}
                    className={`w-full min-h-[44px] text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between ${
                      index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSearch(result.path, result.title)}
                  >
                    <span className="flex-1 text-base">{result.title}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {getTypeLabel(result.type)}
                    </span>
                  </button>
                ))}
              </div>
            ) : recentSearches.length > 0 && !searchTerm && (
              <div className="p-2">
                <div className="text-sm text-gray-500 px-2 py-2">Buscas recentes</div>
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    className="w-full min-h-[44px] text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-base"
                    onClick={() => setSearchTerm(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;