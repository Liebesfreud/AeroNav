CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL,
  pinned INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme_mode TEXT NOT NULL DEFAULT 'system',
  card_density TEXT NOT NULL DEFAULT 'comfortable',
  open_in_new_tab INTEGER NOT NULL DEFAULT 1,
  show_group_icons INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_groups_sort_order ON groups(sort_order);
CREATE INDEX IF NOT EXISTS idx_links_group_sort ON links(group_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_links_pinned ON links(pinned);
CREATE INDEX IF NOT EXISTS idx_links_archived ON links(archived);

INSERT INTO settings (id, theme_mode, card_density, open_in_new_tab, show_group_icons, updated_at)
VALUES (1, 'system', 'comfortable', 1, 1, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
