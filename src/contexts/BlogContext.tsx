import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, Category, BlogState, BlogAction } from '../types/blog';
import { supabase } from '../lib/supabase';

const POSTS_PER_PAGE = 9;

// A interface e o estado inicial não precisam de mudanças.
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
          filteredPosts: action.payload.posts, // Corrigido para garantir que o filtro inicial seja aplicado
          total: action.payload.total,
          page: 1,
          hasMore: action.payload.posts.length < (action.payload.total || 0),
          loading: false,
        };
      case 'ADD_POSTS':
        // Previne posts duplicados ao carregar mais
        const existingPostIds = new Set(state.posts.map(p => p.id));
        const newUniquePosts = action.payload.filter(p => !existingPostIds.has(p.id));
        const allPosts = [...state.posts, ...newUniquePosts];
        return {
            ...state,
            posts: allPosts,
            filteredPosts: allPosts, // Corrigido para garantir que o filtro seja aplicado
            page: state.page + 1,
            hasMore: allPosts.length < state.total,
            loading: false
        };
       case 'SET_CATEGORIES':
        return { ...state, categories: action.payload };
      case 'SET_FILTER':
        // Reseta os posts ao aplicar um novo filtro para forçar uma nova busca
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
        const