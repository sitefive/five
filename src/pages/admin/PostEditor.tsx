import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUpload from '../../components/admin/ImageUpload';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';
import { Author, Category } from '../../types/blog';

// Interface para as opções de tags no seletor
interface TagOption {
    id: string;
    name: string;
}

const PostEditor = () => {
  const { t, i18n } = useTranslation('admin');
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<TagOption[]>([]); // Para listar todas as tags disponíveis

  // Função para gerar o estado inicial do formulário
  const getInitialPostData = () => ({
    pt: { title: '', slug: '', excerpt: '', content: '' },
    en: { title: '', slug: '', excerpt: '', content: '' },
    es: { title: '', slug: '', excerpt: '', content: '' },
    cover_url: '',
    author_id: '',
    category_id: '',
    published_at: null,
    featured: false,
    selected_tags: [] as string[], // Para guardar os IDs das tags selecionadas
  });

  const [postData, setPostData] = useState(getInitialPostData());
  const [currentLang, setCurrentLang] = useState('pt');
  
  // Hook para buscar todos os dados necessários para os formulários
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      const langSuffix = i18n.language.split('-')[0] || 'pt';
      
      try {
        const [authorsRes, categoriesRes, tagsRes] = await Promise.all([
          supabase.from('authors').select(`id, name_pt, name_en, name_es`),
          supabase.from('categories').select(`id, name_pt, name_en, name_es`),
          supabase.from('tags').select(`id, name_pt, name_en, name_es`)
        ]);

        if (authorsRes.error) throw authorsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        if (tagsRes.error) throw tagsRes.error;

        // Formata os dados para os seletores usando o idioma atual da UI
        setAuthors((authorsRes.data || []).map(a => ({ id: a.id, name: a[`name_${langSuffix}`] || a.name_pt })));
        setCategories((categoriesRes.data || []).map(c => ({ id: c.id, name: c[`name_${langSuffix}`] || c.name_pt })));
        setAllTags((tagsRes.data || []).map(t => ({ id: t.id, name: t[`name_${langSuffix}`] || t.name_pt })));

        // Se estiver editando um post, busca seus dados específicos
        if (id) {
          const { data: post, error: postError } = await supabase
            .from('posts').select(`*, post_tags(tag_id)`).eq('id', id).single();
          if (postError) throw postError;

          if (post) {
            setPostData({
              pt: { title: post.title_pt || '', slug: post.slug_pt || '', excerpt: post.excerpt_pt || '', content: post.content_pt || '' },
              en: { title: post.title_en || '', slug: post.slug_en || '', excerpt: post.excerpt_en || '', content: post.content_en || '' },
              es: { title: post.title_es || '', slug: post.slug_es || '', excerpt: post.excerpt_es || '', content: post.content_es || '' },
              cover_url: post.cover_url || '',
              author_id: post.author_id || '',
              category_id: post.category_id || '',
              published_at: post.published_at,
              featured: post.featured,
              selected_tags: post.post_tags?.map((pt: { tag_id: string }) => pt.tag_id) || []
            });
          }
        }
      } catch (error: any) {
        toast.error(t('common.error_loading_data', { message: error.message }));
      } finally {
        setLoading(false);
      }
    };
    fetchFormData();
  }, [id, i18n.language, t]);

  // Funções para lidar com mudanças no formulário
  const handleTitleChange = (value: string) => {
    const slug = slugify(value, { lower: true, strict: true });
    setPostData(prev => ({ ...prev, [currentLang]: { ...prev[currentLang], title: value, slug } }));
  };

  const handleSimpleChange = (name: string, value: any) => {
    setPostData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLanguageDataChange = (field: string, value: string) => {
    setPostData(prev => ({ ...prev, [currentLang]: { ...prev[currentLang], [field]: value } }));
  };

  const handleTagChange = (tagId: string) => {
    setPostData(prev => {
        const selected = prev.selected_tags;
        if (selected.includes(tagId)) {
            return { ...prev, selected_tags: selected.filter(id => id !== tagId) };
        } else {
            return { ...prev, selected_tags: [...selected, tagId] };
        }
    });
  };

  // Função de salvamento principal
  const handleSave = async (publish: boolean) => {
    setLoading(true);
    try {
        const { selected_tags, ...postFieldsData } = postData;
        
        const postToSave = {
            author_id: postFieldsData.author_id || null,
            category_id: postFieldsData.category_id || null,
            cover_url: postFieldsData.cover_url,
            featured: postFieldsData.featured,
            published_at: publish ? new Date().toISOString() : (id ? postFieldsData.published_at : null),
            title_pt: postFieldsData.pt.title, slug_pt: postFieldsData.pt.slug, excerpt_pt: postFieldsData.pt.excerpt, content_pt: postFieldsData.pt.content,
            title_en: postFieldsData.en.title, slug_en: postFieldsData.en.slug, excerpt_en: postFieldsData.en.excerpt, content_en: postFieldsData.en.content,
            title_es: postFieldsData.es.title, slug_es: postFieldsData.es.slug, excerpt_es: postFieldsData.es.excerpt, content_es: postFieldsData.es.content,
        };

        let postId = id;
        if (id) {
            const { error } = await supabase.from('posts').update(postToSave).eq('id', id);
            if (error) throw error;
        } else {
            const { data, error } = await supabase.from('posts').insert(postToSave).select('id').single();
            if (error) throw error;
            postId = data.id;
        }

        if(postId) {
            await supabase.from('post_tags').delete().eq('post_id', postId);
            
            const tagsToInsert = selected_tags.map(tag_id => ({ post_id: postId, tag_id: tag_id }));
            if (tagsToInsert.length > 0) {
                await supabase.from('post_tags').insert(tagsToInsert);
            }
        }

        toast.success(publish ? t('post.published_success') : t('post.saved_success'));
        navigate('/admin/posts');
    } catch (error: any) {
      toast.error(t('post.save_error', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{id ? t('post.edit_post_title') : t('post.new_post_title')}</h1>
        <div className="flex gap-4">
          <button onClick={() => handleSave(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" disabled={loading}>{t('post.save_draft_button')}</button>
          <button onClick={() => handleSave(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={loading}>{t('post.publish_button')}</button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {['pt', 'en', 'es'].map(lang => (<button key={lang} type="button" onClick={() => setCurrentLang(lang)} className={`px-3 py-1 rounded ${currentLang === lang ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{lang.toUpperCase()}</button>))}
        </div>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('post.title_label')}</label>
            <input type="text" value={postData[currentLang].title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{t('post.excerpt_label')}</label>
             <textarea value={postData[currentLang].excerpt} onChange={(e) => handleLanguageDataChange('excerpt', e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('post.content_label')}</label>
            <RichTextEditor content={postData[currentLang].content} onChange={(content) => handleLanguageDataChange('content', content)} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('post.cover_image_label')}</label>
              <ImageUpload value={postData.cover_url} onChange={(url) => handleSimpleChange('cover_url', url)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('post.author_label')}</label>
              <select value={postData.author_id} onChange={(e) => handleSimpleChange('author_id', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="">{t('post.select_author_option')}</option>
                {authors.map((author) => (<option key={author.id} value={author.id}>{author.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('post.category_label')}</label>
              <select value={postData.category_id} onChange={(e) => handleSimpleChange('category_id', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="">{t('post.select_category_option')}</option>
                {categories.map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
              </select>
            </div>
            {/* CAMPO DE SELEÇÃO DE TAGS ADICIONADO */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="p-3 border rounded-lg space-y-2 max-h-40 overflow-y-auto bg-gray-50">
                    {allTags.map((tag) => (
                        <div key={tag.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`tag-${tag.id}`}
                                checked={postData.selected_tags.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`tag-${tag.id}`} className="ml-3 text-sm text-gray-700 select-none">
                                {tag.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="featured" checked={postData.featured} onChange={(e) => handleSimpleChange('featured', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">{t('post.featured_label')}</label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;