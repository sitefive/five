import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, Category, BlogState, BlogAction } from '../types/blog';
import { supabase } from '../lib/supabase';

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

function blogReducer(state: BlogState, action: BlogAction): BlogState {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      case 'SET_INITIAL_DATA':
        const newPosts = action.payload.posts;
        const total = action.payload.total;
        return {
          ...state,
          posts: newPosts,
          filteredPosts: newPosts,
          categories: action.payload.categories,
          total: total,
          page: 1,
          hasMore: newPosts.length < total, // Lógica corrigida aqui
          loading: false,
        };
      case 'ADD_POSTS':
        const combinedPosts = [...state.posts, ...action.payload];
        return {
            ...state,
            posts: combinedPosts,
            filteredPosts: combinedPosts,
            page: state.page + 1,
            hasMore: combinedPosts.length < state.total, // Lógica corrigida aqui
            loading: false
        };
      case 'SET_SEARCH_QUERY':
        return { ...state, page: 1, posts: [], filteredPosts: [], searchQuery: action.payload };
      case 'SET_CATEGORY':
        return { ...state, page: 1, posts: [], filteredPosts: [], currentCategory: action.payload };
      case 'RESET_POSTS':
          return { ...state, posts: [], filteredPosts: [], page: 1, hasMore: true };
      default:
        return state;
    }
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  const fetchAndSetData = useCallback(async (pageToFetch: number, currentSearch: string, currentCategory: Category | null) => {
    if (pageToFetch > 1 && (state.loading || !state.hasMore)) return;
    dispatch({ type: 'SET_LOADING', payload: true });

    const from = (pageToFetch - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    try {
      if (pageToFetch === 1) {
          const { data: categoriesData, error: categoriesError } = await supabase
              .from('categories')
              .select(`id, name:name_${lang}, slug:slug_${lang}`);
          if (categoriesError) throw categoriesError;
          dispatch({ type: 'SET_CATEGORIES', payload: categoriesData || [] });
      }

      let postsQuery = supabase
        .from('posts')
        .select(`
          id, title:title_${lang}, slug:slug_${lang}, excerpt:excerpt_${lang},
          cover_url, published_at, reading_time, featured,
          author:authors(id, name:name_${lang}, avatar),
          category:categories(id, name:name_${lang}, slug:slug_${lang}),
          post_tags:post_tags(tag:tags(id, name:name_${lang}))
        `, { count: 'exact' })
        .order('published_at', { ascending: false })
        .range(from, to);

      if (currentCategory) {
        postsQuery = postsQuery.eq('category_id', currentCategory.id);
      }
      if (currentSearch) {
        const searchPattern = `%${currentSearch}%`;
        postsQuery = postsQuery.or(`title_${lang}.ilike.${searchPattern},excerpt_${lang}.ilike.${searchPattern}`);
      }
      
      const { data: postsData, error: postsError, count: postsCount } = await postsQuery;
      if (postsError) throw postsError;

      const formattedPosts = (postsData || []).map(post => ({ ...post, tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [], }));

      if (pageToFetch === 1) {
        dispatch({
          type: 'SET_INITIAL_DATA',
          payload: { posts: formattedPosts, categories: state.categories, total: postsCount || 0 },
        });
      } else {
        dispatch({ type: 'ADD_POSTS', payload: formattedPosts });
      }

    } catch (error: any) {
      console.error("Erro ao buscar dados do blog:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [lang, state.categories]);

  useEffect(() => {
    fetchAndSetData(1, state.searchQuery, state.currentCategory);
  }, [state.searchQuery, state.currentCategory, lang, fetchAndSetData]);

  const loadMorePosts = useCallback(() => {
    if (!state.loading && state.hasMore) {
        const nextPage = state.page + 1;
        fetchAndSetData(nextPage, state.searchQuery, state.currentCategory);
    }
  }, [state.loading, state.hasMore, state.page, state.searchQuery, state.currentCategory, fetchAndSetData]);
  
  const searchPosts = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const filterByCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

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