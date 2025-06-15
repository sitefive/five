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
  cover_url: string;
  author_id: string;
  category_id: string;
  published_at: string | null;
  featured: boolean;
}

const PostEditor = () => {
  const { t, i18n } = useTranslation('admin'); // Adicionado 't' para traduções
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]); // Tipagem adicionada
  const [categories, setCategories] = useState<Category[]>([]); // Tipagem adicionada

  // --- INÍCIO DA LÓGICA DE PERSISTÊNCIA DE ESTADO (JÁ EXISTENTE) ---
  const localStorageKey = id ? `postEditorData-${id}` : 'postEditorData-new';

  const getInitialPostData = (): PostEditorFormData => {
    // Tenta carregar do localStorage
    try {
      const savedData = localStorage.getItem(localStorageKey);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Falha ao analisar dados do localStorage', error);
      localStorage.removeItem(localStorageKey); // Limpa dados corrompidos
    }

    // Se não houver dados salvos ou houver erro, retorna o estado inicial padrão
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
      try {
        // Fetch authors and categories
        const [authorsData, categoriesData] = await Promise.all([
          supabase.from('authors').select(`id, name_${i18n.language.split('-')[0]} as name`),
          supabase.from('categories').select(`id, name_${i18n.language.split('-')[0]} as name`)
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
              cover_url,
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
  }, [id, localStorageKey, i18n.language]);

  // Efeito para salvar o estado no localStorage sempre que 'postData' mudar
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(postData));
  }, [postData, localStorageKey]);


  const handleTitleChange = (value: string) => {
    // A lógica de langSuffix aqui é para o input de digitação, não para a query
    // const langSuffix = currentLang.split('-')[0]; // Não necessário aqui, apenas no fetch
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
    // Esta parte do handleChange é para campos que NÃO são multilíngues diretamente ligados a postData.pt, en, es
    // Ex: author_id, category_id, featured
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
      // Usar 'pt', 'en', 'es' diretamente para construir os nomes das colunas
      const langSuffixPt = 'pt';
      const langSuffixEn = 'en';
      const langSuffixEs = 'es';

      const postFields = {
        author_id: postData.author_id,
        category_id: postData.category_id,
        cover_url: postData.cover_url,
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
        window.open(`/${currentLang.split('-')[0]}/blog/${currentSlug}`, '_blank'); // Usar langSuffix aqui
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