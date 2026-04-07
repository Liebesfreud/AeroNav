PRAGMA foreign_keys=off;

CREATE TABLE settings_new (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme_mode TEXT NOT NULL DEFAULT 'system',
  card_density TEXT NOT NULL DEFAULT 'comfortable',
  open_in_new_tab INTEGER NOT NULL DEFAULT 1,
  show_group_icons INTEGER NOT NULL DEFAULT 1,
  search_engine TEXT NOT NULL DEFAULT 'bing',
  weather_enabled INTEGER NOT NULL DEFAULT 1,
  weather_auto_locate INTEGER NOT NULL DEFAULT 0,
  temperature_unit TEXT NOT NULL DEFAULT 'system',
  wallpaper_url TEXT,
  wallpaper_overlay_opacity INTEGER NOT NULL DEFAULT 78,
  wallpaper_blur INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

INSERT INTO settings_new (
  id,
  theme_mode,
  card_density,
  open_in_new_tab,
  show_group_icons,
  search_engine,
  weather_enabled,
  weather_auto_locate,
  temperature_unit,
  wallpaper_url,
  wallpaper_overlay_opacity,
  wallpaper_blur,
  updated_at
)
SELECT
  id,
  COALESCE(theme_mode, 'system'),
  COALESCE(card_density, 'comfortable'),
  COALESCE(open_in_new_tab, 1),
  COALESCE(show_group_icons, 1),
  COALESCE(NULLIF(search_engine, ''), 'bing'),
  COALESCE(weather_enabled, 1),
  COALESCE(weather_auto_locate, 0),
  COALESCE(NULLIF(temperature_unit, ''), 'system'),
  wallpaper_url,
  CASE
    WHEN wallpaper_overlay_opacity IS NULL THEN 78
    WHEN wallpaper_overlay_opacity > 0 AND wallpaper_overlay_opacity <= 1 THEN CAST(ROUND(wallpaper_overlay_opacity * 100.0) AS INTEGER)
    ELSE CAST(ROUND(wallpaper_overlay_opacity) AS INTEGER)
  END,
  CASE
    WHEN wallpaper_blur IS NULL THEN 0
    ELSE CAST(ROUND(wallpaper_blur) AS INTEGER)
  END,
  COALESCE(NULLIF(updated_at, ''), CURRENT_TIMESTAMP)
FROM settings;

DROP TABLE settings;
ALTER TABLE settings_new RENAME TO settings;

PRAGMA foreign_keys=on;
