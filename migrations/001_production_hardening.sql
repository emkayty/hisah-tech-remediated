BEGIN;

-- Existing plaintext/legacy sessions are deliberately invalidated during this security migration.
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  username TEXT,
  country TEXT,
  whatsapp_number TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_plan TEXT,
  subscription_expires_at TIMESTAMPTZ,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
UPDATE users
SET password_reset_required = TRUE
WHERE password_hash IS NULL OR password_hash !~ '^\\$2[aby]\\$';

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique ON users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username) WHERE username IS NOT NULL;

CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS token_hash TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
DELETE FROM sessions WHERE token_hash IS NULL;
ALTER TABLE sessions ALTER COLUMN token_hash SET NOT NULL;
DROP INDEX IF EXISTS sessions_token_unique;
CREATE UNIQUE INDEX IF NOT EXISTS sessions_token_hash_unique ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS sessions_user_expiry_index ON sessions(user_id, expires_at);
ALTER TABLE sessions DROP COLUMN IF EXISTS token;

CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY,
  direct_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS direct_key TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE UNIQUE INDEX IF NOT EXISTS conversations_direct_key_unique ON conversations(direct_key) WHERE direct_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS conversation_participants_user_index ON conversation_participants(user_id, conversation_id);

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 4000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS messages_conversation_created_index ON messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_size BIGINT NOT NULL DEFAULT 0,
  downloads BIGINT NOT NULL DEFAULT 0,
  uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS file_comments (
  id BIGSERIAL PRIMARY KEY,
  file_id BIGINT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS file_comments_file_created_index ON file_comments(file_id, created_at);

CREATE TABLE IF NOT EXISTS file_ratings (
  file_id BIGINT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (file_id, user_id)
);

CREATE TABLE IF NOT EXISTS payment_settings (
  provider TEXT PRIMARY KEY CHECK (provider IN ('stripe', 'paypal', 'paystack', 'crypto')),
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);
INSERT INTO payment_settings (provider, enabled)
VALUES ('stripe', FALSE), ('paypal', FALSE), ('paystack', FALSE), ('crypto', FALSE)
ON CONFLICT (provider) DO NOTHING;

CREATE TABLE IF NOT EXISTS payment_orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL CHECK (provider IN ('stripe')),
  provider_reference TEXT UNIQUE,
  payment_intent_id TEXT UNIQUE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('standard_monthly', 'standard_yearly', 'premium_monthly')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL CHECK (currency = LOWER(currency) AND char_length(currency) = 3),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled', 'failed')) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS payment_orders_user_created_index ON payment_orders(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payment_events (
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ai_conversations_user_created_index ON ai_conversations(user_id, created_at DESC);

COMMIT;
