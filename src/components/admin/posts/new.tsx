import React from 'react';
import PostForm from './PostForm';

const NewPostPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
      <PostForm />
    </div>
  );
};

export default NewPostPage;
