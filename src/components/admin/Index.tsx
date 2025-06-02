import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import CategoryModal from './CategoryModal';
import TagModal from './TagModal';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openTagModal, setOpenTagModal] = useState(false);

  // Fetch categories and tags
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      toast.error('Error fetching categories');
    } else {
      setCategories(data);
    }
  };

  const fetchTags = async () => {
    const { data, error } = await supabase.from('tags').select('*');
    if (error) {
      toast.error('Error fetching tags');
    } else {
      setTags(data);
    }
  };

  const handleSavePost = async (status: 'draft' | 'published') => {
    if (!title) {
      toast.error('Title is required');
      return;
    }

    const { error } = await supabase.from('posts').insert({
      title,
      excerpt,
      content,
      image: featuredImage,
      categories: selectedCategories,
      tags: selectedTags,
      status,
      created_at: new Date(),
    });

    if (error) {
      console.error(error);
      toast.error('Error saving post');
    } else {
      toast.success(status === 'published' ? 'Post published' : 'Draft saved');
      // Clear form
      setTitle('');
      setExcerpt('');
      setContent('');
      setFeaturedImage('');
      setSelectedCategories([]);
      setSelectedTags([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Post Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Excerpt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter a short summary for the post..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor content={content} onChange={setContent} />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Publish */}
        <Card>
          <CardHeader>
            <CardTitle>Publish</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => handleSavePost('draft')}>
              Save as Draft
            </Button>
            <Button onClick={() => handleSavePost('published')}>
              Publish
            </Button>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ImageUpload onSelect={(url) => setFeaturedImage(url)} />
            {featuredImage && (
              <div className="relative">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="rounded-lg"
                />
                <button
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpenCategoryModal(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories((prev) => [...prev, cat.id]);
                    } else {
                      setSelectedCategories((prev) =>
                        prev.filter((id) => id !== cat.id)
                      );
                    }
                  }}
                />
                {cat.name}
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tags</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpenTagModal(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags((prev) => [...prev, tag.id]);
                    } else {
                      setSelectedTags((prev) =>
                        prev.filter((id) => id !== tag.id)
                      );
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {openCategoryModal && (
        <CategoryModal
          isOpen={openCategoryModal}
          onClose={() => {
            setOpenCategoryModal(false);
            fetchCategories();
          }}
        />
      )}

      {openTagModal && (
        <TagModal
          isOpen={openTagModal}
          onClose={() => {
            setOpenTagModal(false);
            fetchTags();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
