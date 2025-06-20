// Tipos relacionados aos usuários
export interface User {
  id?: string;
  name: string;
  email?: string;
  password?: string;
  role: 'editor' | 'admin';
  active: boolean;
  auth_user?: {
    email?: string;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'editor' | 'admin';
  active: boolean;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  user?: User;
}

// Tipos relacionados aos autores
export interface Author {
  id: string;
  name?: string; // Nome no idioma atual (será mapeado no frontend)
  avatar?: string;
  bio?: string; // Bio no idioma atual
  // Propriedades multilíngues brutas (para buscar do DB)
  name_pt?: string;
  name_en?: string;
  name_es?: string;
  bio_pt?: string;
  bio_en?: string;
  bio_es?: string;
}

// Tipos relacionados às categorias
export interface Category {
  id: string;
  name: string; // Nome no idioma atual
  slug: string; // Slug no idioma atual
  description?: string; // Descrição no idioma atual
  created_at?: string;
  // Propriedades multilíngues brutas (para buscar do DB)
  name_pt?: string;
  name_en?: string;
  name_es?: string;
  slug_pt?: string;
  slug_en?: string;
  slug_es?: string;
  description_pt?: string;
  description_en?: string;
  description_es?: string;
}

export interface CategoryFormData { // <--- CORRIGIDO AQUI
  name_pt: string;
  name_en: string;
  name_es: string;
  slug_pt: string;
  slug_en: string;
  slug_es: string;
  description_pt?: string;
  description_en?: string;
  description_es?: string;
}

// Tipos relacionados às tags
export interface Tag {
  id: string;
  name: string;
  slug?: string; // Adicionado para consistência, se tags tiverem slug
  postCount?: number; // Para a contagem de posts em TagList
  // Propriedades multilíngues brutas
  name_pt?: string;
  name_en?: string;
  name_es?: string;
  slug_pt?: string; // Adicionado para consistência
  slug_en?: string;
  slug_es?: string;
}

// Tipos relacionados aos posts
export interface Post {
  id: string;
  title: string; // Título no idioma atual (mapeado no frontend)
  slug: string; // Slug no idioma atual (mapeado no frontend)
  content: string; // Conteúdo no idioma atual (mapeado no frontend)
  excerpt: string; // Resumo no idioma atual (mapeado no frontend)
  cover_url: string; // Imagem de capa
  language?: string; // Idioma primário do post (para o banco, se houver)
  category_id?: string;
  author_id?: string;
  published_at: string | null; // Pode ser null para rascunhos
  created_at?: string;
  updated_at?: string;
  featured?: boolean;
  reading_time?: number;

  // Dados de relações (JOINs) formatados para o idioma atual
  author?: Author; // Objeto Author já formatado
  category?: Category; // Objeto Category já formatado
  tags?: string[]; // Array de nomes de tags já formatado

  // Propriedades multilíngues brutas (para buscar do DB e usar em formulários)
  title_pt?: string; title_en?: string; title_es?: string;
  slug_pt?: string; slug_en?: string; slug_es?: string;
  excerpt_pt?: string; excerpt_en?: string; excerpt_es?: string;
  content_pt?: string; content_en?: string; content_es?: string;
}

export interface PostFormData { // <--- CORRIGIDO AQUI
  title_pt: string;
  title_en: string;
  title_es: string;
  slug_pt: string;
  slug_en: string;
  slug_es: string;
  content_pt: string;
  content_en: string;
  content_es: string;
  excerpt_pt: string;
  excerpt_en: string;
  excerpt_es: string;
  cover_url: string;
  language: string;
  category_id: string;
  author_id?: string;
  published_at: string | null; // Adicionado para Publicar/Rascunho
  featured: boolean; // Adicionado
}

// Tipos relacionados à newsletter
export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface NewsletterFormData {
  email: string;
}

// Tipos relacionados ao blog context
export interface BlogState {
  posts: Post[];
  filteredPosts: Post[];
  categories: Category[];
  searchQuery: string;
  currentCategory: Category | null;
  page: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

export type BlogAction =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'RESET_POSTS' }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: Category | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'INCREMENT_PAGE' }
  | { type: 'SET_TOTAL'; payload: number };

// Tipos genéricos auxiliares
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}