BEGIN;
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 180),
  excerpt TEXT NOT NULL DEFAULT '' CHECK (char_length(excerpt) <= 500),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 20 AND 50000),
  category TEXT NOT NULL DEFAULT 'How to repair',
  cover_image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_updated_idx ON blog_posts(updated_at DESC);
COMMIT;
