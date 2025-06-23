import React, { createContext, useContext, useReducer, useCallback } from 'react';
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
  fetchPosts: () => void;
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
    case 'SET_POSTS':
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
        filteredPosts: filterPosts([...state.posts, ...action.payload], state.searchQuery, state.currentCategory),
        hasMore: action.payload.length === POSTS_PER_PAGE
      };
    case 'RESET_POSTS':
      return {
        ...state,
        posts: [],
        filteredPosts: [],
        page: 1,
        hasMore: true
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        filteredPosts: filterPosts(state.posts, action.payload, state.currentCategory)
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
        filteredPosts: filterPosts(state.posts, state.searchQuery, action.payload)
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'INCREMENT_PAGE':
      return {
        ...state,
        page: state.page + 1
      };
    case 'SET_TOTAL':
      return {
        ...state,
        total: action.payload
      };
    default:
      return state;
  }
}

function filterPosts(posts: Post[], query: string, category: Category | null): Post[] {
  return posts.filter(post => {
    const matchesQuery = !query || 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = !category || post.category?.id === category.id;
    
    return matchesQuery && matchesCategory;
  });
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { i18n } = useTranslation();

  const fetchPosts = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const langSuffix = i18n.language.split('-')[0];
      
      // Query corrigida com nome correto da coluna e filtros adequados
      let query = supabase
        .from('posts')
        .select(`
          id,
          title_${langSuffix} as title,
          slug_${langSuffix} as slug,
          excerpt_${langSuffix} as excerpt,
          content_${langSuffix} as content,
          cover_url,
          published_at,
          reading_time,
          featured,
          created_at,
          author:authors(
            id,
            name_${langSuffix} as name,
            avatar,
            bio_${langSuffix} as bio
          ),
          category:categories(
            id,
            name_${langSuffix} as name,
            slug_${langSuffix} as slug,
            description_${langSuffix} as description
          ),
          post_tags:post_tags(
            tag:tags(
              id,
              name_${langSuffix} as name
            )
          )
        `)
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      // Aplicar filtros se necessário
      if (state.searchQuery) {
        query = query.or(`title_${langSuffix}.ilike.%${state.searchQuery}%,excerpt_${langSuffix}.ilike.%${state.searchQuery}%`);
      }

      if (state.currentCategory) {
        query = query.eq('category_id', state.currentCategory.id);
      }

      // Paginação
      const from = (state.page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data: posts, error, count } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar posts do blog' });
        return;
      }

      // Formatar posts
      const formattedPosts = (posts || []).map(post => ({
        ...post,
        tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag?.name).filter(Boolean) : [],
      }));

      dispatch({ type: 'SET_POSTS', payload: formattedPosts });
      if (count !== null) {
        dispatch({ type: 'SET_TOTAL', payload: count });
      }

    } catch (error: any) {
      console.error('Error in fetchPosts:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados do blog' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [i18n.language, state.page, state.searchQuery, state.currentCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const langSuffix = i18n.language.split('-')[0];
      
      const { data: categories, error } = await supabase
        .from('categories')
        .select(`
          id,
          name_${langSuffix} as name,
          slug_${langSuffix} as slug,
          description_${langSuffix} as description
        `)
        .order(`name_${langSuffix}`);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      dispatch({ type: 'SET_CATEGORIES', payload: categories || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [i18n.language]);

  // Carregar dados iniciais
  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    dispatch({ type: 'RESET_POSTS' });
    fetchPosts();
  }, [i18n.language, state.searchQuery, state.currentCategory]);

  React.useEffect(() => {
    if (state.page > 1) {
      fetchPosts();
    }
  }, [state.page, fetchPosts]);

  const searchPosts = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    dispatch({ type: 'RESET_POSTS' });
  }, []);

  const filterByCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
    dispatch({ type: 'RESET_POSTS' });
  }, []);

  const loadMorePosts = useCallback(() => {
    if (!state.loading && state.hasMore) {
      dispatch({ type: 'INCREMENT_PAGE' });
    }
  }, [state.loading, state.hasMore]);

  const value = {
    state,
    dispatch,
    searchPosts,
    filterByCategory,
    loadMorePosts,
    fetchPosts,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}