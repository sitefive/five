import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUpload from '../../components/admin/ImageUpload';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';

interface PostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
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
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [postData, setPostData] = useState<Record<string, PostData>>({
    pt: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      author_id: '',
      category_id: '',
      published_at: null,
      featured: false
    },
    en: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      author_id: '',
      category_id: '',
      published_at: null,
      featured: false
    },
    es: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      author_id: '',
      category_id: '',
      published_at: null,
      featured: false
    }
  });
  const [currentLang, setCurrentLang] = useState('pt');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch authors and categories
        const [authorsData, categoriesData] = await Promise.all([
          supabase.from('authors').select('*'),
          supabase.from('categories').select('*')
        ]);

        setAuthors(authorsData.data || []);
        setCategories(categoriesData.data || []);

        // Fetch post data if editing
        if (id) {
          const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          // Set post data for each language
          const updatedPostData = { ...postData };
          ['pt', 'en', 'es'].forEach(lang => {
            updatedPostData[lang] = {
              ...updatedPostData[lang],
              title: post[`title_${lang}`] || '',
              slug: post[`slug_${lang}`] || '',
              excerpt: post[`excerpt_${lang}`] || '',
              content: post[`content_${lang}`] || '',
              cover_image: post.cover_image || '',
              author_id: post.author_id || '',
              category_id: post.category_id || '',
              published_at: post.published_at,
              featured: post.featured
            };
          });
          setPostData(updatedPostData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const handleSave = async (publish: boolean = false) => {
    setLoading(true);
    try {
      const postFields = {
        author_id: postData.pt.author_id,
        category_id: postData.pt.category_id,
        cover_image: postData.pt.cover_image,
        featured: postData.pt.featured,
        published_at: publish ? new Date().toISOString() : null,
        ...Object.entries(postData).reduce((acc, [lang, data]) => ({
          ...acc,
          [`title_${lang}`]: data.title,
          [`slug_${lang}`]: data.slug,
          [`excerpt_${lang}`]: data.excerpt,
          [`content_${lang}`]: data.content
        }), {})
      };

      if (id) {
        await supabase
          .from('posts')
          .update(postFields)
          .eq('id', id);
      } else {
        await supabase
          .from('posts')
          .insert([postFields]);
      }

      toast.success(publish ? 'Post published!' : 'Post saved!');
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error saving post');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (id) {
      window.open(`/admin/preview/${id}`, '_blank');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-4">
          {id && (
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              disabled={loading}
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            Publish
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
              Title
            </label>
            <input
              type="text"
              value={postData[currentLang].title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={postData[currentLang].slug}
              onChange={(e) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], slug: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="post-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={postData[currentLang].excerpt}
              onChange={(e) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], excerpt: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Brief description of the post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <RichTextEditor
              content={postData[currentLang].content}
              onChange={(content) => setPostData(prev => ({
                ...prev,
                [currentLang]: { ...prev[currentLang], content }
              }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <ImageUpload
            value={postData[currentLang].cover_image}
            onChange={(url) => setPostData(prev => ({
              ...prev,
              [currentLang]: { ...prev[currentLang], cover_image: url }
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <select
            value={postData[currentLang].author_id}
            onChange={(e) => setPostData(prev => ({
              ...prev,
              [currentLang]: { ...prev[currentLang], author_id: e.target.value }
            }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={postData[currentLang].category_id}
            onChange={(e) => setPostData(prev => ({
              ...prev,
              [currentLang]: { ...prev[currentLang], category_id: e.target.value }
            }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select category</option>
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
            checked={postData[currentLang].featured}
            onChange={(e) => setPostData(prev => ({
              ...prev,
              [currentLang]: { ...prev[currentLang], featured: e.target.checked }
            }))}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured post
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;