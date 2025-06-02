// /src/admin/posts/index.tsx
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AuthGuard from '../../components/AuthGuard';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/RichTextEditor';
import { CategoryModal } from '../../components/CategoryModal';
import { TagModal } from '../../components/TagModal';
import ImageUpload from '../../components/ImageUpload';
import toast from 'react-hot-toast';

interface Post {
  id?: string;
  title: string;
  summary: string;
  content: string;
  status: 'draft' | 'published';
  featured_image: string | null;
  categories: string[]; // array de UUIDs
  tags: string[];       // array de UUIDs
}

const PostsAdminPage: React.FC = () => {
  const [post, setPost] = useState<Post>({
    title: '',
    summary: '',
    content: '',
    status: 'draft',
    featured_image: null,
    categories: [],
    tags: [],
  });

  const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
  const [allTags, setAllTags] = useState<{ id: string; name: string }[]>([]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Carregar categorias e tags ao montar
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('id, name').order('name');
    if (error) {
      toast.error('Erro ao carregar categorias');
      return;
    }
    setAllCategories(data || []);
  };

  const fetchTags = async () => {
    const { data, error } = await supabase.from('tags').select('id, name').order('name');
    if (error) {
      toast.error('Erro ao carregar tags');
      return;
    }
    setAllTags(data || []);
  };

  // Atualizar campos do post
  const handleChange = (field: keyof Post, value: any) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  // Salvar ou publicar post
  const handleSave = async (status: 'draft' | 'published') => {
    if (!post.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    if (!post.summary.trim()) {
      toast.error('Resumo é obrigatório');
      return;
    }
    if (!post.content.trim()) {
      toast.error('Conteúdo é obrigatório');
      return;
    }

    try {
      const payload = {
        title: post.title,
        summary: post.summary,
        content: post.content,
        status,
        featured_image: post.featured_image,
        categories: post.categories,
        tags: post.tags,
        updated_at: new Date().toISOString(),
      };

      // Se tiver id (edição) usa update, senão insere novo
      if (post.id) {
        const { error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', post.id);
        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
          .select()
          .single();
        if (error) throw error;
        setPost(data);
        toast.success('Post criado com sucesso!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar post');
    }
  };

  // Toggle seleção em array
  const toggleArrayValue = (arr: string[], val: string) => {
    if (arr.includes(val)) {
      return arr.filter((i) => i !== val);
    } else {
      return [...arr, val];
    }
  };

  return (
    <AdminLayout>
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-6">Criar / Editar Post</h1>

          {/* Título */}
          <input
            type="text"
            placeholder="Título"
            value={post.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
          />

          {/* Resumo */}
          <textarea
            placeholder="Resumo"
            value={post.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded h-20"
          />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Editor Rich Text */}
            <div className="flex-1">
              <RichTextEditor
                content={post.content}
                onChange={(content) => handleChange('content', content)}
              />
            </div>

            {/* Sidebar direita */}
            <aside className="w-full lg:w-72 space-y-6">
              {/* Imagem destacada */}
              <div>
                <h2 className="font-semibold mb-2">Imagem Destacada</h2>
                <ImageUpload
                  imageUrl={post.featured_image}
                  onUpload={(url) => handleChange('featured_image', url)}
                />
              </div>

              {/* Categorias */}
              <div>
                <h2 className="font-semibold mb-2 flex justify-between items-center">
                  Categorias
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    + Nova
                  </button>
                </h2>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto border rounded p-2">
                  {allCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`px-3 py-1 rounded text-sm border ${
                        post.categories.includes(cat.id)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() =>
                        handleChange('categories', toggleArrayValue(post.categories, cat.id))
                      }
                      type="button"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h2 className="font-semibold mb-2 flex justify-between items-center">
                  Tags
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => setIsTagModalOpen(true)}
                  >
                    + Nova
                  </button>
                </h2>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto border rounded p-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      className={`px-3 py-1 rounded text-sm border ${
                        post.tags.includes(tag.id)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => handleChange('tags', toggleArrayValue(post.tags, tag.id))}
                      type="button"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões salvar / publicar */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleSave('draft')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 rounded"
                >
                  Salvar Rascunho
                </button>
                <button
                  onClick={() => handleSave('published')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Publicar
                </button>
              </div>
            </aside>
          </div>

          {/* Modais */}
          {isCategoryModalOpen && (
            <CategoryModal
              isOpen={isCategoryModalOpen}
              onClose={() => {
                setIsCategoryModalOpen(false);
                fetchCategories();
              }}
            />
          )}
          {isTagModalOpen && (
            <TagModal
              isOpen={isTagModalOpen}
              onClose={() => {
                setIsTagModalOpen(false);
                fetchTags();
              }}
            />
          )}
        </div>
      </AuthGuard>
    </AdminLayout>
  );
};

export default PostsAdminPage;
