import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUpload from '../../components/admin/ImageUpload';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';
import { Author, Category } from '../../types/blog'; // Importe Author e Category para tipagem

interface PostDataFields { // Interface para os campos do post por idioma
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  // cover_url, author_id, category_id, published_at, featured são globais do post, não por idioma
}

interface PostEditorFormData { // Interface completa para o estado postData
  pt: PostDataFields;
  en: PostDataFields;
  es: PostDataFields;
  cover_url: string; // <-- Padronizado para cover_url
  author_id: string;
  category_id: string;
  published_at: string | null;
  featured: boolean;
}

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]); // Tipagem adicionada
  const [categories, setCategories] = useState<Category[]>([]); // Tipagem adicionada

  // --- INÍCIO DA LÓGICA DE PERSISTÊNCIA DE ESTADO ---
  const localStorageKey = id ? `postEditorData-${id}` : 'postEditorData-new';

  const getInitialPostData = (): PostEditorFormData => {
    // Tenta carregar do localStorage
    try {
      const savedData = localStorage.getItem(localStorageKey);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
      localStorage.removeItem(localStorageKey); // Limpa dados corrompidos
    }

    // Se não houver dados salvos ou houver erro, retorna o estado inicial padrão
    return {
      pt: { title: '', slug: '', excerpt: '', content: '' },
      en: { title: '', slug: '', excerpt: '', content: '' },
      es: { title: '', slug: '', excerpt: '', content: '' },
      cover_url: '', // <-- Padronizado para cover_url
      author_id: '',
      category_id: '',
      published_at: null,
      featured: false
    };
  };

  const [postData, setPostData] = useState<PostEditorFormData>(getInitialPostData);
  const [currentLang, setCurrentLang] = useState('pt');
  // --- FIM DA LÓGICA DE PERSISTÊNCIA DE ESTADO ---


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch authors and categories
        const [authorsData, categoriesData] = await Promise.all([
          supabase.from('authors').select(`id, name_${i18n.language} as name`),
          supabase.from('categories').select(`id, name_${i18n.language} as name`)
        ]);

        if (authorsData.error) throw authorsData.error;
        if (categoriesData.error) throw categoriesData.error;

        setAuthors(authorsData.data || []);
        setCategories(categoriesData.data || []);

        // Fetch post data if editing
        if (id) {
          const { data: post, error } = await supabase
            .from('posts')
            .select(`
              id,
              title_pt, title_en, title_es,
              slug_pt, slug_en, slug_es,
              excerpt_pt, excerpt_en, excerpt_es,
              content_pt, content_en, content_es,
              cover_url, /* Usar cover_url aqui */
              author_id,
              category_id,
              published_at,
              featured
            `)
            .eq('id', id)
            .single();

          if (error) throw error;

          // Atualiza o estado com os dados carregados do Supabase
          const loadedPostData: PostEditorFormData = {
            pt: {
              title: post.title_pt || '', slug: post.slug_pt || '',
              excerpt: post.excerpt_pt || '', content: post.content_pt || ''
            },
            en: {
              title: post.title_en || '', slug: post.slug_en || '',
              excerpt: post.excerpt_en || '', content: post.content_en || ''
            },
            es: {
              title: post.title_es || '', slug: post.slug_es || '',
              excerpt: post.excerpt_es || '', content: post.content_es || ''
            },
            cover_url: post.cover_url || '', // <-- Padronizado para cover_url
            author_id: post.author_id || '',
            category_id: post.category_id || '',
            published_at: post.published_at,
            featured: post.featured
          };
          setPostData(loadedPostData);
          localStorage.setItem(localStorageKey, JSON.stringify(loadedPostData)); // Salva os dados carregados
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(`Erro ao carregar dados: ${error.message || 'Verifique o console.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, localStorageKey]); // Adicione localStorageKey para re-executar se a chave mudar (útil se o ID mudar)

  // Efeito para salvar o estado no localStorage sempre que 'postData' mudar
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(postData));
  }, [postData, localStorageKey]);


  const handleTitleChange = (value: string) => {
    const langSuffix = currentLang.split('-')[0]; // Garante 'pt', 'en', 'es'
    const slug = slugify(value, { lower: true, strict: true });
    setPostData(prev => ({
      ...prev,
      [currentLang]: {
        ...prev[currentLang],
        title: value,
        slug
      }
    }));
  };

  // Funções de alteração para outros campos (já existem no seu código)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('name_') || name.startsWith('slug_') || name.startsWith('excerpt_') || name.startsWith('content_')) {
        // Isso não deve acontecer com a UI atual, mas como fallback
        setPostData(prev => ({
            ...prev,
            [name.split('_')[1]]: { // Extrai o idioma do nome do campo
                ...prev[name.split('_')[1] as keyof typeof prev],
                [name.split('_')[0]]: value // Extrai o nome do campo (title, excerpt, etc)
            }
        }));
    } else {
        setPostData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }
  };

  const handleRichTextChange = (content: string) => {
    setPostData(prev => ({
      ...prev,
      [currentLang]: { ...prev[currentLang], content }
    }));
  };

  const handleImageChange = (url: string) => {
    setPostData(prev => ({
      ...prev,
      cover_url: url // <-- Padronizado para cover_url
    }));
  };


  const handleSave = async (publish: boolean = false) => {
    setLoading(true);
    try {
      // Mapeia o idioma completo para o sufixo da coluna no DB
      const langSuffixPt = 'pt'; // Opcional, mas garante consistência
      const langSuffixEn = 'en';
      const langSuffixEs = 'es';

      const postFields = {
        author_id: postData.author_id,
        category_id: postData.category_id,
        cover_url: postData.cover_url, // <-- Padronizado para cover_url
        featured: postData.featured,
        published_at: publish ? new Date().toISOString() : null,
        // Campos multilíngues
        [`title_${langSuffixPt}`]: postData.pt.title,
        [`slug_${langSuffixPt}`]: postData.pt.slug,
        [`excerpt_${langSuffixPt}`]: postData.pt.excerpt,
        [`content_${langSuffixPt}`]: postData.pt.content,

        [`title_${langSuffixEn}`]: postData.en.title,
        [`slug_${langSuffixEn}`]: postData.en.slug,
        [`excerpt_${langSuffixEn}`]: postData.en.excerpt,
        [`content_${langSuffixEn}`]: postData.en.content,

        [`title_${langSuffixEs}`]: postData.es.title,
        [`slug_${langSuffixEs}`]: postData.es.slug,
        [`excerpt_${langSuffixEs}`]: postData.es.excerpt,
        [`content_${langSuffixEs}`]: postData.es.content,
      };

      let operationError = null;
      if (id) {
        const { error } = await supabase
          .from('posts')
          .update(postFields)
          .eq('id', id);
        operationError = error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postFields]);
        operationError = error;
      }

      if (operationError) throw operationError;

      // Limpa os dados do localStorage após salvar com sucesso
      localStorage.removeItem(localStorageKey);

      toast.success(publish ? 'Post publicado!' : 'Post salvo!'); // Traduzido
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(`Erro ao salvar post: ${error.message || 'Verifique o console.'}`); // Traduzido
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (id) {
      // Mapeia o idioma atual para o slug correspondente
      const currentSlug = postData[currentLang].slug;
      if (currentSlug) {
        window.open(`/${currentLang}/blog/${currentSlug}`, '_blank'); // Abre no idioma correto
      } else {
        toast.error('O post precisa ter um slug para pré-visualização.');
      }
    } else {
      toast.error('Salve o post como rascunho primeiro para pré-visualizar.');
    }
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>; // Traduzido
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Post' : 'New Post'} {/* Título em EN, será traduzido pelo i18n */}
        </h1>
        <div className="flex gap-4">
          {id && (
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              disabled={loading}
            >
              <Eye className="w-4 h-4" />
              Visualizar {/* Traduzido */}
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Save Draft {/* Botão em EN, será traduzido pelo i18n */}
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            Publish {/* Botão em EN, será traduzido pelo i18n */}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {['pt', 'en', 'es'].map(lang => (
            <button
              key={lang}
              onClick={() => setCurrentLang(lang)}
              className={`px-3 py-1 rounded ${
                currentLang === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title {/* Rótulo em EN, será traduzido pelo i18n */}
            </label>
            <input
              type="text"
              value={postData[currentLang as keyof typeof postData].title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Digite o título do post" // Traduzido placeholder
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug {/* Rótulo em EN, será traduzido pelo i18n */}
            </label>
            <input
              type="text"
              value={postData[currentLang as keyof typeof postData].slug}
              onChange={(e) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], slug: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="post-slug" // Traduzido placeholder
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt {/* Rótulo em EN, será traduzido pelo i18n */}
            </label>
            <textarea
              value={postData[currentLang as keyof typeof postData].excerpt}
              onChange={(e) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], excerpt: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Breve descrição do post" // Traduzido placeholder
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content {/* Rótulo em EN, será traduzido pelo i18n */}
            </label>
            <RichTextEditor
              content={postData[currentLang as keyof typeof postData].content}
              onChange={handleRichTextChange} // Usando a função dedicada
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image {/* Rótulo em EN, será traduzido pelo i18n */}
          </label>
          <ImageUpload
            value={postData.cover_url} // A imagem de capa é global, não por idioma
            onChange={handleImageChange} // Usando a função dedicada
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author {/* Rótulo em EN, será traduzido pelo i18n */}
          </label>
          <select
            value={postData.author_id} // Autor é global, não por idioma
            onChange={(e) => setPostData(prev => ({
              ...prev,
              author_id: e.target.value
            }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Selecionar autor</option> {/* Traduzido */}
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category {/* Rótulo em EN, será traduzido pelo i18n */}
          </label>
          <select
            value={postData.category_id} // Categoria é global, não por idioma
            onChange={(e) => setPostData(prev => ({
              ...prev,
              category_id: e.target.value
            }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Selecionar categoria</option> {/* Traduzido */}
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={postData.featured} // Featured é global, não por idioma
            onChange={(e) => setPostData(prev => ({
              ...prev,
              featured: e.target.checked
            }))}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured post {/* Rótulo em EN, será traduzido pelo i18n */}
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;