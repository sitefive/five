import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUpload from '../../components/admin/ImageUpload';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';
// Importe as interfaces completas e as Raw do seu types/blog
import { Author, Category, PostEditorFormData, PostFormData } from '../../types/blog'; // Certifique-se de importar PostEditorFormData e PostFormData

// Interfaces auxiliares para os dados brutos que vêm do DB antes de formatar
// Elas precisam refletir EXATAMENTE o que a query vai retornar
interface RawAuthorFromDB {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  // Adicione outras colunas de autor que a query busca, se houver
}

interface RawCategoryFromDB {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  slug_pt: string; // Adicionado slug para Category
  slug_en: string;
  slug_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  // Adicione outras colunas de categoria que a query busca, se houver
}

interface RawPostFromDB {
  id: string;
  published_at: string | null;
  created_at: string;
  featured: boolean;
  cover_url: string;
  author_id: string;
  category_id: string;
  
  // Todas as colunas de idioma para Post
  title_pt: string; title_en: string; title_es: string;
  slug_pt: string; slug_en: string; slug_es: string;
  excerpt_pt: string; excerpt_en: string; excerpt_es: string;
  content_pt: string; content_en: string; content_es: string;
}


const PostEditor = () => {
  const { t, i18n } = useTranslation('admin');
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // --- INÍCIO DA LÓGICA DE PERSISTÊNCIA DE ESTADO ---
  const localStorageKey = id ? `postEditorData-${id}` : 'postEditorData-new';

  const getInitialPostData = (): PostEditorFormData => {
    try {
      const savedData = localStorage.getItem(localStorageKey);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Falha ao analisar dados do localStorage', error);
      localStorage.removeItem(localStorageKey); // Limpa dados corrompidos
    }

    return {
      pt: { title: '', slug: '', excerpt: '', content: '' },
      en: { title: '', slug: '', excerpt: '', content: '' },
      es: { title: '', slug: '', excerpt: '', content: '' },
      cover_url: '',
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
      const langSuffix = i18n.language.split('-')[0]; // Pega o sufixo do idioma da UI

      try {
        // --- INÍCIO DA CORREÇÃO DEFINITIVA DA QUERY (Buscar todas as colunas de idioma) ---
        const [authorsData, categoriesData] = await Promise.all([
          supabase.from('authors').select(`id, name_pt, name_en, name_es`), // Buscar todos os nomes de autor
          supabase.from('categories').select(`id, name_pt, name_en, name_es, slug_pt, slug_en, slug_es, description_pt, description_en, description_es`) // Buscar todos os nomes de categoria e slugs
        ]);

        if (authorsData.error) throw authorsData.error;
        if (categoriesData.error) throw categoriesData.error;

        // Formatar autores
        const formattedAuthors: Author[] = (authorsData.data as RawAuthorFromDB[] || []).map(rawAuthor => ({
          id: rawAuthor.id,
          name: rawAuthor[`name_${langSuffix}` as keyof RawAuthorFromDB] || rawAuthor.name_pt || t('common.no_name_fallback')
        }));
        setAuthors(formattedAuthors);

        // Formatar categorias
        const formattedCategories: Category[] = (categoriesData.data as RawCategoryFromDB[] || []).map(rawCategory => ({
          id: rawCategory.id,
          name: rawCategory[`name_${langSuffix}` as keyof RawCategoryFromDB] || rawCategory.name_pt || t('common.no_name_fallback'),
          slug: rawCategory[`slug_${langSuffix}` as keyof RawCategoryFromDB] || rawCategory.slug_pt || 'no-slug',
          description: rawCategory[`description_${langSuffix}` as keyof RawCategoryFromDB] || rawCategory.description_pt || ''
        }));
        setCategories(formattedCategories);

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
              cover_url,
              author_id,
              category_id,
              published_at,
              featured
            `) // REMOVIDO ALIAS 'as name' E ADICIONADO TODOS OS CAMPOS _lang
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
            cover_url: post.cover_url || '',
            author_id: post.author_id || '',
            category_id: post.category_id || '',
            published_at: post.published_at,
            featured: post.featured
          };
          setPostData(loadedPostData);
          localStorage.setItem(localStorageKey, JSON.stringify(loadedPostData)); // Salva os dados carregados
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        toast.error(t('common.error_loading_data', { message: error.message || 'Verifique o console.' }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, localStorageKey, i18n.language, t]); // Adicionado 't' para garantir que fetchData re-execute se a função de tradução mudar (não comum, mas boa prática)

  // Efeito para salvar o estado no localStorage sempre que 'postData' mudar
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(postData));
  }, [postData, localStorageKey]);


  const handleTitleChange = (value: string) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setPostData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
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
      cover_url: url
    }));
  };


  const handleSave = async (publish: boolean = false) => {
    setLoading(true);
    try {
      const langSuffixPt = 'pt';
      const langSuffixEn = 'en';
      const langSuffixEs = 'es';

      // --- ATENÇÃO: postFields é a forma como os dados são enviados para o DB ---
      const postFields: PostFormData = { // Tipagem explícita aqui
        author_id: postData.author_id,
        category_id: postData.category_id,
        cover_url: postData.cover_url,
        featured: postData.featured,
        published_at: publish ? new Date().toISOString() : null,
        // language: currentLang.split('-')[0], // <<== LINHA REMOVIDA
        // Campos multilíngues
        title_pt: postData.pt.title,
        slug_pt: postData.pt.slug,
        excerpt_pt: postData.pt.excerpt,
        content_pt: postData.pt.content,

        title_en: postData.en.title,
        slug_en: postData.en.slug,
        excerpt_en: postData.en.excerpt,
        content_en: postData.en.content,

        title_es: postData.es.title,
        slug_es: postData.es.slug,
        excerpt_es: postData.es.excerpt,
        content_es: postData.es.content,
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

      toast.success(publish ? t('post.published_success') : t('post.saved_success'));
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(t('post.save_error', { message: error.message || 'Verifique o console.' }));
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (id) {
      const currentSlug = postData[currentLang as keyof typeof postData].slug;
      if (currentSlug) {
        window.open(`/${currentLang.split('-')[0]}/blog/${currentSlug}`, '_blank');
      } else {
        toast.error(t('post.preview_no_slug_error'));
      }
    } else {
      toast.error(t('post.preview_save_draft_error'));
    }
  };

  if (loading) {
    return <div className="p-4">{t('common.loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? t('post.edit_post_title') : t('post.new_post_title')}
        </h1>
        <div className="flex gap-4">
          {id && (
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              disabled={loading}
            >
              <Eye className="w-4 h-4" />
              {t('post.preview_button')}
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            {t('post.save_draft_button')}
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {t('post.publish_button')}
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
              {t('post.title_label')}
            </label>
            <input
              type="text"
              value={postData[currentLang as keyof typeof postData].title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t('post.title_placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('post.slug_label')}
            </label>
            <input
              type="text"
              value={postData[currentLang as keyof typeof postData].slug}
              onChange={(e) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], slug: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t('post.slug_placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('post.excerpt_label')}
            </label>
            <textarea
              value={postData[currentLang as keyof typeof postData].excerpt}
              onChange={(e) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], excerpt: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder={t('post.excerpt_placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('post.content_label')}
            </label>
            <RichTextEditor
              content={postData[currentLang as keyof typeof postData].content}
              onChange={handleRichTextChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('post.cover_image_label')}
          </label>
          <ImageUpload
            value={postData.cover_url}
            onChange={handleImageChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('post.author_label')}
          </label>
          <select
            value={postData.author_id}
            onChange={(e) => setPostData(prev => ({
              ...prev,
              author_id: e.target.value
            }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">{t('post.select_author_option')}</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('post.category_label')}
          </label>
          <select
            value={postData.category_id}
            onChange={(e) => setPostData(prev => ({
              ...prev,
              category_id: e.target.value
            }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">{t('post.select_category_option')}</option>
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
            checked={postData.featured}
            onChange={(e) => setPostData(prev => ({
              ...prev,
              featured: e.target.checked
            }))}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            {t('post.featured_label')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;