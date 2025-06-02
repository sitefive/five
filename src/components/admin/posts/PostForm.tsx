import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

import RichTextEditor from '../RichTextEditor';
import ImageUpload from '../ImageUpload';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

const PostForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  /** 🔗 Carregar categorias e tags disponíveis */
  const fetchCategoriesAndTags = async () => {
    const { data: catData, error: catError } = await supabase.from('categories').select();
    const { data: tagData, error: tagError } = await supabase.from('tags').select();

    if (catError) console.error(catError);
    if (tagError) console.error(tagError);

    if (catData) setAvailableCategories(catData);
    if (tagData) setAvailableTags(tagData);
  };

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  /** 🚀 Enviar post para o Supabase */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Title and Content are required.');
      return;
    }

    setLoading(true);

    const slug = slugify(title, { lower: true, strict: true });

    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        summary,
        content,
        status,
        featured_image: featuredImage,
        language: 'pt', // Ajuste conforme necessidade
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create post');
      console.error(error);
      setLoading(false);
      return;
    }

    const postId = data.id;

    /** 🏷️ Inserir categorias */
    if (categories.length > 0) {
      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert(categories.map((categoryId) => ({
          post_id: postId,
          category_id: categoryId,
        })));

      if (categoryError) console.error(categoryError);
    }

    /** 🔖 Inserir tags */
    if (tags.length > 0) {
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(tags.map((tagId) => ({
          post_id: postId,
          tag_id: tagId,
        })));

      if (tagError) console.error(tagError);
    }

    toast.success('Post created successfully');
    setLoading(false);
    navigate('/admin/posts');
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left - Main content */}
      <div className="lg:col-span-2 space-y-4">
        {/* Title */}
        <div className="bg-white rounded shadow p-4">
          <label className="block mb-2 font-medium">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Summary */}
        <div className="bg-white rounded shadow p-4">
          <label className="block mb-2 font-medium">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded shadow p-4">
          <label className="block mb-2 font-medium">Content *</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Right - Sidebar */}
      <div className="space-y-4">
        {/* Publish */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium mb-2">Publish</h2>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium mb-2">Featured Image</h2>
          <ImageUpload value={featuredImage} onChange={setFeaturedImage} />
        </div>

        {/* Categories */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium mb-2">Categories</h2>
          <div className="space-y-2">
            {availableCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={categories.includes(cat.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategories([...categories, cat.id]);
                    } else {
                      setCategories(categories.filter((c) => c !== cat.id));
                    }
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-medium mb-2">Tags</h2>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={tags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTags([...tags, tag.id]);
                    } else {
                      setTags(tags.filter((t) => t !== tag.id));
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
