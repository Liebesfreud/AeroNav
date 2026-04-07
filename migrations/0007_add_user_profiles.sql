CREATE TABLE IF NOT EXISTS user_profiles (
  subject TEXT PRIMARY KEY,
  display_name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
