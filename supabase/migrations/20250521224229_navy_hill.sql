/*
  # Add multilingual support to existing tables
  
  1. Changes
    - Add language-specific columns (pt, en, es) to posts, categories, authors, and tags
    - Migrate existing data to language columns
    - Remove old single-language columns
    - Add unique constraints for slugs and names in each language
    
  2. Data Migration
    - Copy existing content to all language variants
    - Ensure no data loss during migration
    
  3. Constraints
    - Add unique constraints for slugs and names per language
*/

-- Add language columns to posts table
ALTER TABLE posts
  ADD COLUMN title_pt text,
  ADD COLUMN title_en text,
  ADD COLUMN title_es text,
  ADD COLUMN slug_pt text,
  ADD COLUMN slug_en text,
  ADD COLUMN slug_es text,
  ADD COLUMN excerpt_pt text,
  ADD COLUMN excerpt_en text,
  ADD COLUMN excerpt_es text,
  ADD COLUMN content_pt text,
  ADD COLUMN content_en text,
  ADD COLUMN content_es text;

-- Add unique constraints for post slugs
ALTER TABLE posts
  ADD CONSTRAINT posts_slug_pt_key UNIQUE (slug_pt),
  ADD CONSTRAINT posts_slug_en_key UNIQUE (slug_en),
  ADD CONSTRAINT posts_slug_es_key UNIQUE (slug_es);

-- Add language columns to categories table
ALTER TABLE categories
  ADD COLUMN name_pt text,
  ADD COLUMN name_en text,
  ADD COLUMN name_es text,
  ADD COLUMN slug_pt text,
  ADD COLUMN slug_en text,
  ADD COLUMN slug_es text,
  ADD COLUMN description_pt text,
  ADD COLUMN description_en text,
  ADD COLUMN description_es text;

-- Add unique constraints for category slugs
ALTER TABLE categories
  ADD CONSTRAINT categories_slug_pt_key UNIQUE (slug_pt),
  ADD CONSTRAINT categories_slug_en_key UNIQUE (slug_en),
  ADD CONSTRAINT categories_slug_es_key UNIQUE (slug_es);

-- Add language columns to authors table
ALTER TABLE authors
  ADD COLUMN name_pt text,
  ADD COLUMN name_en text,
  ADD COLUMN name_es text,
  ADD COLUMN bio_pt text,
  ADD COLUMN bio_en text,
  ADD COLUMN bio_es text;

-- Add language columns to tags table
ALTER TABLE tags
  ADD COLUMN name_pt text,
  ADD COLUMN name_en text,
  ADD COLUMN name_es text;

-- Add unique constraints for tag names
ALTER TABLE tags
  ADD CONSTRAINT tags_name_pt_key UNIQUE (name_pt),
  ADD CONSTRAINT tags_name_en_key UNIQUE (name_en),
  ADD CONSTRAINT tags_name_es_key UNIQUE (name_es);

-- Migrate existing data to language columns
DO $$
BEGIN
  -- Migrate posts
  UPDATE posts SET
    title_pt = title,
    title_en = title,
    title_es = title,
    slug_pt = slug,
    slug_en = slug,
    slug_es = slug,
    excerpt_pt = excerpt,
    excerpt_en = excerpt,
    excerpt_es = excerpt,
    content_pt = content,
    content_en = content,
    content_es = content;

  -- Migrate categories
  UPDATE categories SET
    name_pt = name,
    name_en = name,
    name_es = name,
    slug_pt = slug,
    slug_en = slug,
    slug_es = slug,
    description_pt = description,
    description_en = description,
    description_es = description;

  -- Migrate authors
  UPDATE authors SET
    name_pt = name,
    name_en = name,
    name_es = name,
    bio_pt = bio,
    bio_en = bio,
    bio_es = bio;

  -- Migrate tags
  UPDATE tags SET
    name_pt = name,
    name_en = name,
    name_es = name;
END $$;

-- Drop old columns
ALTER TABLE posts
  DROP COLUMN title,
  DROP COLUMN slug,
  DROP COLUMN excerpt,
  DROP COLUMN content;

ALTER TABLE categories
  DROP COLUMN name,
  DROP COLUMN slug,
  DROP COLUMN description;

ALTER TABLE authors
  DROP COLUMN name,
  DROP COLUMN bio;

ALTER TABLE tags
  DROP COLUMN name;