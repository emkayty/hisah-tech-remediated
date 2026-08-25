CREATE TABLE IF NOT EXISTS forum_categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_threads (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES forum_categories(id) ON DELETE RESTRICT,
  author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 4 AND 160),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id BIGSERIAL PRIMARY KEY,
  thread_id BIGINT NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS forum_threads_category_updated_idx ON forum_threads(category_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS forum_threads_author_idx ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS forum_replies_thread_created_idx ON forum_replies(thread_id, created_at);

INSERT INTO forum_categories (slug, name, description, sort_order) VALUES
  ('general-repair', 'General repair', 'Ask practical repair questions and share useful approaches.', 10),
  ('bios-firmware', 'BIOS & firmware', 'Discuss firmware identification, flashing, and recovery.', 20),
  ('schematics-diagnostics', 'Schematics & diagnostics', 'Work through board diagrams, measurements, and fault finding.', 30),
  ('tools-workflows', 'Tools & workflows', 'Share repair tools, bench workflows, and proven processes.', 40)
ON CONFLICT (slug) DO NOTHING;
