CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  content     JSONB NOT NULL DEFAULT '{}',
  excerpt     TEXT,
  cover_image TEXT,
  mood        TEXT,
  mood_emoji  TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug
  ON posts(slug);

CREATE INDEX IF NOT EXISTS idx_posts_published_date
  ON posts(published, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_featured
  ON posts(is_featured)
  WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_posts_tags
  ON posts USING GIN(tags);

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_posts_search
  ON posts USING GIN(search_vector);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  confirmed       BOOLEAN NOT NULL DEFAULT FALSE,
  token           TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email
  ON newsletter_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed
  ON newsletter_subscribers(confirmed)
  WHERE confirmed = TRUE AND unsubscribed_at IS NULL;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_public_read" ON posts;
CREATE POLICY "posts_public_read" ON posts
  FOR SELECT
  USING (published = TRUE);

DROP POLICY IF EXISTS "posts_admin_all" ON posts;
CREATE POLICY "posts_admin_all" ON posts
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscribers_service_only" ON newsletter_subscribers;
CREATE POLICY "subscribers_service_only" ON newsletter_subscribers
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "blog_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-media');

CREATE POLICY "blog_media_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-media'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "blog_media_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-media'
    AND auth.role() = 'authenticated'
  );

INSERT INTO posts (slug, title, content, excerpt, mood, mood_emoji, is_featured, tags, published)
VALUES (
  'bem-vindo',
  'Bem-vindo ao blog',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Este é o primeiro post do blog. O começo de muitas histórias."}]}]}',
  'Este é o primeiro post do blog. O começo de muitas histórias.',
  'Animado',
  '😄',
  TRUE,
  ARRAY['geral'],
  TRUE
)
ON CONFLICT (slug) DO NOTHING;
