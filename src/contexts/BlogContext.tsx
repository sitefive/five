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
  loading: true,
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
        return {
          ...state,
          posts: action.payload.posts,
          filteredPosts: action.payload.posts,
          total: action.payload.total,
          page: 1,
          hasMore: action.payload.posts.length < (action.payload.total || 0),
          loading: false,
        };
      case 'ADD_POSTS':
        const existingPostIds = new Set(state.posts.map(p => p.id));
        const newUniquePosts = action.payload.filter(p => !existingPostIds.has(p.id));
        const allPosts = [...state.posts, ...newUniquePosts];
        return {
            ...state,
            posts: allPosts,
            filteredPosts: allPosts,
            page: state.page + 1,
            hasMore: allPosts.length < state.total,
            loading: false
        };
      case 'SET_CATEGORIES':
        return { ...state, categories: action.payload };
      case 'SET_FILTER':
        return { ...state, page: 1, posts: [], filteredPosts: [], hasMore: true, ...action.payload };
      default:
        return state;
    }
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  const fetchPosts = useCallback(async (pageToFetch: number, currentCategory: Category | null, searchQuery: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const from = (pageToFetch - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    try {
        let postsQuery = supabase
          .from('posts')
          .select(`
            id, title:title_${lang}, slug:slug_${lang}, excerpt:excerpt_${lang},
            cover_url, published_at, reading_time, featured,
            author:authors(id, name:name_${lang}, avatar),
            category:categories(id, name:name_${lang}, slug:slug_${lang}),
            post_tags:post_tags(tag:tags(id, name:name_${lang}))
          `, { count: 'exact' })
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .range(from, to);

        if (currentCategory) {
          postsQuery = postsQuery.eq('category_id', currentCategory.id);
        }
        if (searchQuery) {
          const searchPattern = `%${searchQuery}%`;
          postsQuery = postsQuery.or(`title_${lang}.ilike.${searchPattern},excerpt_${lang}.ilike.${searchPattern}`);
        }
       
        const { data: postsData, error: postsError, count: postsCount } = await postsQuery;
        if (postsError) throw postsError;

        const formattedPosts = (postsData || []).map(post => ({ ...post, tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [], }));

        if (pageToFetch === 1) {
          dispatch({ type: 'SET_INITIAL_DATA', payload: { posts: formattedPosts, categories: state.categories, total: postsCount || 0 }});
        } else {
          dispatch({ type: 'ADD_POSTS', payload: formattedPosts });
        }

    } catch (error: any) {
      console.error("Erro ao buscar posts:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [lang, dispatch]); 
 
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
        const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select(`id, name:name_${lang}, slug:slug_${lang}, posts(count)`);
       
        if(categoriesError) {
            console.error("Erro ao buscar categorias:", categoriesError);
            return;
        }

        const formattedCategories = categoriesData.map(cat => ({
            ...cat,
            count: cat.posts[0]?.count || 0
        }));

        if (isMounted) {
            dispatch({ type: 'SET_CATEGORIES', payload: formattedCategories });
        }
    };
    fetchCategories();

    return () => {
        isMounted = false;
    };
  }, [lang, dispatch]);

  useEffect(() => {
    fetchPosts(1, state.currentCategory, state.searchQuery);
  }, [fetchPosts, state.currentCategory, state.searchQuery]);

  const loadMorePosts = useCallback(() => {
    if (!state.loading && state.hasMore) {
        fetchPosts(state.page + 1, state.currentCategory, state.searchQuery);
    }
  }, [fetchPosts, state.page, state.loading, state.hasMore, state.currentCategory, state.searchQuery]);
 
  const searchPosts = useCallback((query: string) => {
    dispatch({ type: 'SET_FILTER', payload: { searchQuery: query, currentCategory: null } });
  }, [dispatch]);

  const filterByCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'SET_FILTER', payload: { currentCategory: category, searchQuery: '' } });
  }, [dispatch]);

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