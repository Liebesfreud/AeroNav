CREATE TABLE IF NOT EXISTS web_panels (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  open_mode TEXT NOT NULL DEFAULT 'iframe',
  enabled INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_web_panels_enabled ON web_panels(enabled);
CREATE INDEX IF NOT EXISTS idx_web_panels_sort_order ON web_panels(sort_order);
