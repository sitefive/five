import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, Category, BlogState, BlogAction } from '../types/blog';
import { supabase } from '../lib/supabase'; // Certifique-se que o caminho está correto

const POSTS_PER_PAGE = 9;

interface BlogContextType {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
  searchPosts: (query: string) => void;
  filterByCategory: (category: Category | null) => void;
  loadMorePosts: () => void;
}

const initialState: BlogState = {
  posts: [],
  filteredPosts: [],
  categories: [],
  searchQuery: '',
  currentCategory: null,
  page: 1,
  loading: false,
  error: null,
  hasMore: true,
  total: 0
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// O reducer continua o mesmo
function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DATA':
      return {
        ...state,
        posts: action.payload.posts,
        filteredPosts: action.payload.posts, // Inicialmente, os posts filtrados são todos os posts
        categories: action.payload.categories,
        total: action.payload.total,
        page: 1,
        hasMore: action.payload.posts.length > 0,
        loading: false
      };
    case 'ADD_POSTS':
        return {
            ...state,
            posts: [...state.posts, ...action.payload.posts],
            filteredPosts: [...state.posts, ...action.payload.posts], // Atualiza com os novos posts
            page: state.page + 1,
            hasMore: action.payload.posts.length === POSTS_PER_PAGE,
            loading: false
        };
    case 'APPLY_FILTERS':
        return {
            ...state,
            searchQuery: action.payload.searchQuery,
            currentCategory: action.payload.currentCategory,
            filteredPosts: state.posts.filter(post => {
                const matchesQuery = !action.payload.searchQuery ||
                    post.title.toLowerCase().includes(action.payload.searchQuery.toLowerCase()) ||
                    post.excerpt.toLowerCase().includes(action.payload.searchQuery.toLowerCase());

                const matchesCategory = !action.payload.currentCategory || (post.category && post.category.id === action.payload.currentCategory.id);
                
                return matchesQuery && matchesCategory;
            })
        };
    default:
      return state;
  }
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // Debounce para a busca
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(state.searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearchQuery(state.searchQuery);
    }, 300); // 300ms de delay

    return () => {
        clearTimeout(handler);
    };
  }, [state.searchQuery]);


  // Efeito principal para buscar os dados
  useEffect(() => {
    const fetchInitialData = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Monta a query para os posts
        let query = supabase
            .from('posts')
            .select(`
                id,
                title:title_${lang},
                slug:slug_${lang},
                excerpt:excerpt_${lang},
                cover_url,
                published_at,
                reading_time,
                featured,
                author:authors(id, name:name_${lang}, avatar),
                category:categories(id, name:name_${lang}, slug:slug_${lang}),
                post_tags:post_tags(tag:tags(id, name:name_${lang}))
            `, { count: 'exact' })
            .order('published_at', { ascending: false })
            .limit(POSTS_PER_PAGE);

        // Adiciona filtros de categoria e busca se existirem
        if(state.currentCategory) {
            query = query.eq('category_id', state.currentCategory.id);
        }
        
        // ========= CORREÇÃO APLICADA AQUI Nº 1 =========
        if(debouncedSearchQuery) {
            const searchPattern = `%${debouncedSearchQuery}%`;
            query = query.or(`title_${lang}.ilike.${searchPattern},excerpt_${lang}.ilike.${searchPattern}`);
        }

        try {
            // Executa a query dos posts e categorias em paralelo
            const [postResult, categoryResult] = await Promise.all([
                query,
                supabase.from('categories').select(`id, name:name_${lang}, slug:slug_${lang}`)
            ]);

            if (postResult.error) throw postResult.error;
            if (categoryResult.error) throw categoryResult.error;

            const formattedPosts = (postResult.data || []).map(post => ({
                ...post,
                tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [],
            }));
            
            dispatch({ type: 'SET_DATA', payload: {
                posts: formattedPosts,
                categories: categoryResult.data || [],
                total: postResult.count || 0,
            }});

        } catch (error: any) {
            console.error("Erro ao buscar dados do blog:", error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    fetchInitialData();
  }, [lang, state.currentCategory, debouncedSearchQuery]); // Re-executa quando o idioma, categoria ou busca mudam


  const loadMorePosts = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    const from = state.page * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    let query = supabase
            .from('posts')
            .select(`
                id,
                title:title_${lang},
                slug:slug_${lang},
                excerpt:excerpt_${lang},
                cover_url,
                published_at,
                reading_time,
                featured,
                author:authors(id, name:name_${lang}, avatar),
                category:categories(id, name:name_${lang}, slug:slug_${lang}),
                post_tags:post_tags(tag:tags(id, name:name_${lang}))
            `)
            .order('published_at', { ascending: false })
            .range(from, to);

    if(state.currentCategory) {
        query = query.eq('category_id', state.currentCategory.id);
    }

    // ========= CORREÇÃO APLICADA AQUI Nº 2 =========
    if(debouncedSearchQuery) {
        const searchPattern = `%${debouncedSearchQuery}%`;
        query = query.or(`title_${lang}.ilike.${searchPattern},excerpt_${lang}.ilike.${searchPattern}`);
    }

    try {
        const { data, error } = await query;
        if (error) throw error;
        
        const formattedPosts = (data || []).map(post => ({
            ...post,
            tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [],
        }));

        dispatch({ type: 'ADD_POSTS', payload: { posts: formattedPosts } });

    } catch (error: any) {
        console.error("Erro ao carregar mais posts:", error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
    }

  }, [state.loading, state.hasMore, state.page, lang, state.currentCategory, debouncedSearchQuery]);

  const searchPosts = useCallback((query: string) => {
    dispatch({ type: 'APPLY_FILTERS', payload: { searchQuery: query, currentCategory: state.currentCategory } });
  }, [state.currentCategory]);
  
  const filterByCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'APPLY_FILTERS', payload: { searchQuery: state.searchQuery, currentCategory: category } });
  }, [state.searchQuery]);

  const value = { state, dispatch, searchPosts, filterByCategory, loadMorePosts };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}