-- Personal Library schema
-- Recreated because schema.sql/seeds.sql were empty in the repo
-- (the actual source of truth was the CSV export)
-- NOTE: the backend also applies users/user_id automatically on startup
-- (see backend/db/migrate.js), so this file is for fresh setups/reference.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS authors (
  author_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS series (
  series_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_title TEXT,
  author_id INTEGER REFERENCES authors(author_id) ON DELETE SET NULL,
  series_id INTEGER REFERENCES series(series_id) ON DELETE SET NULL,
  series_order NUMERIC,
  status TEXT,
  date_started DATE,
  date_finished DATE,
  date_unknown BOOLEAN DEFAULT FALSE,
  rating INTEGER,
  format TEXT,
  genre TEXT,
  location TEXT,
  publication_year INTEGER,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_books_title_trgm ON books USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_books_original_title_trgm ON books USING gin (original_title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books (user_id);
CREATE INDEX IF NOT EXISTS idx_books_author_id ON books (author_id);
CREATE INDEX IF NOT EXISTS idx_books_series_id ON books (series_id);
