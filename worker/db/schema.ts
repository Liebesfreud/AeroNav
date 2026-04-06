export type Env = {
  DB: D1Database
  ASSETS: Fetcher
  APP_NAME?: string
}

export type User = {
  email: string
  subject: string
  name: string | null
}

export type GroupRow = {
  id: string
  name: string
  icon: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type LinkRow = {
  id: string
  group_id: string
  title: string
  url: string
  icon: string | null
  description: string | null
  sort_order: number
  pinned: number
  archived: number
  created_at: string
  updated_at: string
}

export type SettingsRow = {
  id: number
  theme_mode: 'light' | 'dark' | 'system'
  card_density: 'compact' | 'comfortable'
  open_in_new_tab: number
  show_group_icons: number
  updated_at: string
}
