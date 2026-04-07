PRAGMA foreign_keys=off;

CREATE TABLE links_new (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  icon_mode TEXT NOT NULL DEFAULT 'favicon',
  icon_image_url TEXT,
  icon_text TEXT,
  open_mode TEXT NOT NULL DEFAULT 'global',
  background_color TEXT,
  tile_size TEXT NOT NULL DEFAULT '1x3',
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

INSERT INTO links_new (
  id, group_id, title, url, icon, description, sort_order, created_at, updated_at,
  icon_mode, icon_image_url, icon_text, open_mode, background_color, tile_size
)
SELECT
  id, group_id, title, url, icon, description, sort_order, created_at, updated_at,
  icon_mode, icon_image_url, icon_text, open_mode, background_color, tile_size
FROM links;

DROP TABLE links;
ALTER TABLE links_new RENAME TO links;

CREATE INDEX IF NOT EXISTS idx_links_group_sort ON links(group_id, sort_order);

PRAGMA foreign_keys=on;
