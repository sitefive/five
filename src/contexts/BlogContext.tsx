import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, Category, BlogState, BlogAction } from '../types/blog';
import { useSupabaseCache } from '../hooks/useSupabaseCache';

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
        posts: [],
        page: 1,
        hasMore: true
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
        posts: [],
        page: 1,
        hasMore: true
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
    
    const matchesCategory = !category || post.category.id === category.id;
    
    return matchesQuery && matchesCategory;
  });
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  const { i18n } = useTranslation();
  const { fetchData: fetchPosts } = useSupabaseCache('posts', {
    select: `
      id,
      title_${i18n.language} as title,
      slug_${i18n.language} as slug,
      excerpt_${i18n.language} as excerpt,
      content_${i18n.language} as content,
      cover_url,
      published_at,
      reading_time,
      featured,
      author:authors(
        id,
        name_${i18n.language} as name,
        avatar,
        bio_${i18n.language} as bio
      ),
      category:categories(
        id,
        name_${i18n.language} as name,
        slug_${i18n.language} as slug
      ),
      post_tags:post_tags(
        tag:tags(
          id,
          name_${i18n.language} as name
        )
      )
    `,
    filters: {
      published_at: { operator: 'not.is', value: null },
    },
    pagination: {
      page: state.page,
      perPage: POSTS_PER_PAGE,
    },
    search: state.searchQuery ? {
      column: `title_${i18n.language}`,
      query: state.searchQuery,
    } : undefined,
    categoryId: state.currentCategory?.id,
    onSuccess: (posts) => {
      const formattedPosts = posts.map(post => ({
        ...post,
        tags: post.post_tags ? post.post_tags.map((pt: any) => pt.tag.name) : [],
      }));
      dispatch({ type: 'SET_POSTS', payload: formattedPosts });
    },
    onError: () => {
      dispatch({ type: 'SET_ERROR', payload: 'Error loading blog data' });
    },
  });

  const { fetchData: fetchCategories } = useSupabaseCache('categories', {
    select: `
      id,
      name_${i18n.language} as name,
      slug_${i18n.language} as slug,
      description_${i18n.language} as description
    `,
    orderBy: 'name',
    onSuccess: (categories) => {
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    },
    onError: (error) => {
      console.error('Error fetching categories:', error);
    },
  });

  const searchPosts = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const filterByCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
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