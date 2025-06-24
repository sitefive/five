import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, Category, BlogState, BlogAction } from '../types/blog';
import { supabase } from '../lib/supabase';

const POSTS_PER_PAGE = 9;

interface BlogContextType {
  state: BlogState;
  searchPosts: (query: string) => void;
  filterByCategory: (category: Category | null) => void;
  loadMorePosts: () => void;
}

const initialState: BlogState = {
  posts: [],
  filteredPosts: [], // Mantido para consistência, mas a filtragem principal é na query
  categories: [],
  searchQuery: '',
  currentCategory: null,
  page: 1,
  loading: true, // Começa como true
  error: null,
  hasMore: true,
  total: 0
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_DATA':
      return {
        ...state,
        posts: action.payload.posts,
        filteredPosts: action.payload.posts,
        categories: action.payload.categories,
        total: action.payload.total,
        page: 1,
        hasMore: action.payload.posts.length < (action.payload.total || 0),
        loading: false,
      };
    case 'ADD_POSTS':
      const newPosts = [...state.posts, ...action.payload];
      return {
        ...state,
        posts: newPosts,
        filteredPosts: newPosts,
        page: state.page + 1,
        hasMore: newPosts.length < state.total,
        loading: false,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTER':
      return { ...state, page: 1, posts: [], filteredPosts: [], ...action.payload };
    default:
      return state;
  }
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch({ type: 'START_LOADING' });

      try {
        const langSuffix = lang || 'pt';

        let postsQuery = supabase
          .from('posts')
          .select(`
            id, title:title_${langSuffix}, slug:slug_${langSuffix}, excerpt:excerpt_${langSuffix},
            cover_url, published_at, reading_time, featured,
            author:authors(id, name:name_${langSuffix}, avatar),
            category:categories(id, name:name_${langSuffix}, slug:slug_${langSuffix}),
            post_tags:post_tags(tag:tags(id, name:name_${langSuffix}))
          `, { count: 'exact' })
          .order('published_at', { ascending: false })
          .limit(POSTS_PER_PAGE);

        if (state.currentCategory) {
          postsQuery = postsQuery.eq('category_id', state.currentCategory.id);
        }
        if (state.searchQuery) {
          const searchPattern = `%${state.searchQuery}%`;
          postsQuery = postsQuery.or(`title_${langSuffix}.ilike.${searchPattern},excerpt_${langSuffix}.ilike.${searchPattern}`);
        }

        const [postResult, categoryResult] = await Promise.all([
          postsQuery,
          supabase.from('categories').select(`id, name:name_${langSuffix}, slug:slug_${langSuffix}`)
        ]);

        if (postResult.error) throw postResult.error;
        if (categoryResult.error) throw categoryResult.error;

        const formattedPosts = (postResult.data || []).map(post => ({
          ...post,
          tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [],
        }));

        dispatch({
          type: 'SET_DATA',
          payload: {
            posts: formattedPosts,
            categories: categoryResult.data || [],
            total: postResult.count || 0,
          },
        });

      } catch (error: any) {
        console.error("Erro ao buscar dados do blog:", error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };
    fetchInitialData();
  }, [lang, state.searchQuery, state.currentCategory]);


  const loadMorePosts = useCallback(async () => {
    if (state.loading || !state.hasMore) return;
    dispatch({ type: 'SET_LOADING', payload: true });

    const from = state.page * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    try {
        const langSuffix = lang || 'pt';
        let postsQuery = supabase.from('posts').select(`...`).order('published_at', { ascending: false }).range(from, to);
        // Recriar a query com os mesmos filtros para a paginação
        if (state.currentCategory) {
          postsQuery = postsQuery.eq('category_id', state.currentCategory.id);
        }
        if (state.searchQuery) {
          const searchPattern = `%${state.searchQuery}%`;
          postsQuery = postsQuery.or(`title_${langSuffix}.ilike.${searchPattern},excerpt_${langSuffix}.ilike.${searchPattern}`);
        }
      
        const { data, error } = await postsQuery;
        if (error) throw error;

        const formattedPosts = (data || []).map(post => ({ ...post, tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [], }));
        dispatch({ type: 'ADD_POSTS', payload: formattedPosts });

    } catch (error: any) {
      console.error("Erro ao carregar mais posts:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.loading, state.hasMore, state.page, state.searchQuery, state.currentCategory, lang]);

  const searchPosts = useCallback((query: string) => {
    dispatch({ type: 'SET_FILTER', payload: { searchQuery: query } });
  }, []);

  const filterByCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'SET_FILTER', payload: { currentCategory: category, searchQuery: '' } });
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