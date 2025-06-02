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

// Tipos relacionados às categorias
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
}

// Tipos relacionados aos posts
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url: string;
  language: string;
  category_id: string;
  created_at: string;
  updated_at?: string;
  category?: Category;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url: string;
  language: string;
  category_id: string;
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

// Tipos genéricos auxiliares
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
