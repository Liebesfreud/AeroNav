ALTER TABLE links ADD COLUMN icon_mode TEXT NOT NULL DEFAULT 'favicon';
ALTER TABLE links ADD COLUMN icon_image_url TEXT;
ALTER TABLE links ADD COLUMN icon_text TEXT;
ALTER TABLE links ADD COLUMN open_mode TEXT NOT NULL DEFAULT 'global';
ALTER TABLE links ADD COLUMN background_color TEXT;
