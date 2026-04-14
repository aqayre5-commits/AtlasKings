-- Migration 001: Push subscriptions table
-- Run this once against your Neon database to enable persistent push subscriptions.
--
-- Usage:
--   psql $DATABASE_URL -f lib/db/migrations/001_push_subscriptions.sql

CREATE SCHEMA IF NOT EXISTS atlas;

CREATE TABLE IF NOT EXISTS atlas.push_subscriptions (
  endpoint    TEXT PRIMARY KEY,
  keys_p256dh TEXT NOT NULL,
  keys_auth   TEXT NOT NULL,
  categories  TEXT[] DEFAULT '{breaking}',
  lang        VARCHAR(2) DEFAULT 'en',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category-based push targeting
CREATE INDEX IF NOT EXISTS idx_push_subs_categories
  ON atlas.push_subscriptions USING GIN (categories);

-- Index for language-based push targeting
CREATE INDEX IF NOT EXISTS idx_push_subs_lang
  ON atlas.push_subscriptions (lang);

COMMENT ON TABLE atlas.push_subscriptions IS 'Web Push notification subscriptions — persisted across deployments';
