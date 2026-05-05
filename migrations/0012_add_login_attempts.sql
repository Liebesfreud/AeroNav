CREATE TABLE IF NOT EXISTS login_attempts (
  identifier TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  first_attempt_at INTEGER NOT NULL,
  locked_until INTEGER,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until ON login_attempts(locked_until);
