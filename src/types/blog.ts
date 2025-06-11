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
  name?: string; // name_pt, name_en, etc. serão mapeados para 'name'
  avatar?: string;
  bio?: string; // bio_pt, bio_en, etc. serão mapeados para 'bio'
  // Propriedades multilíngues brutas
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
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  // Propriedades multilíngues brutas
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

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  // Propriedades multilíngues
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

// Tipos relacionados às tags
export interface Tag {
  id: string;
  name: string;
  slug?: string;
  postCount?: number; // Para a contagem de posts em TagList
  // Propriedades multilíngues brutas
  name_pt?: string;
  name_en?: string;
  name_es?: string;
}

// Tipos relacionados aos posts
export interface Post {
  id: string;
  title: string; // Isso será o title_${lang} formatado
  slug: string; // Isso será o slug_${lang} formatado
  content: string;
  excerpt: string;
  cover_url: string; // PADRONIZADO AQUI
  language?: string;
  category_id?: string;
  author_id?: string;
  published_at: string | null; // Pode ser null para rascunhos
  created_at?: string;
  updated_at?: string;
  featured?: boolean;
  reading_time?: number;

  // Dados de relações (JOINs) - Opcional, pois podem não vir em todas as queries
  author?: Author; // Objeto completo do autor
  category?: Category; // Objeto completo da categoria
  tags?: string[]; // Array de nomes das tags (já formatado por PostList/BlogContext)

  // Propriedades multilíngues brutas (para uso em formulários como PostEditor)
  title_pt?: string;
  title_en?: string;
  title_es?: string;
  slug_pt?: string;
  slug_en?: string;
  slug_es?: string;
  excerpt_pt?: string;
  excerpt_en?: string;
  excerpt_es?: string;
  content_pt?: string;
  content_en?: string;
  content_es?: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url: string; // PADRONIZADO AQUI
  language: string;
  category_id: string;
  author_id?: string;
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