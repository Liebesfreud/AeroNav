import type { GroupRow, LinkRow, SettingsRow, Env } from './schema'

export function nowIso() {
  return new Date().toISOString()
}

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}

export function mapGroup(row: GroupRow) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapLink(row: LinkRow) {
  return {
    id: row.id,
    groupId: row.group_id,
    title: row.title,
    url: row.url,
    icon: row.icon,
    description: row.description,
    tileSize: row.tile_size,
    sortOrder: row.sort_order,
    pinned: Boolean(row.pinned),
    archived: Boolean(row.archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapSettings(row: SettingsRow) {
  return {
    themeMode: row.theme_mode,
    cardDensity: row.card_density,
    openInNewTab: Boolean(row.open_in_new_tab),
    showGroupIcons: Boolean(row.show_group_icons),
    searchEngine: row.search_engine,
    weatherEnabled: Boolean(row.weather_enabled),
    weatherAutoLocate: Boolean(row.weather_auto_locate),
    temperatureUnit: row.temperature_unit,
    updatedAt: row.updated_at,
  }
}

export async function listGroups(env: Env) {
  const { results } = await env.DB.prepare('SELECT * FROM groups ORDER BY sort_order ASC, created_at ASC').all<GroupRow>()
  return results.map(mapGroup)
}

export async function listLinks(env: Env) {
  const { results } = await env.DB.prepare('SELECT * FROM links ORDER BY pinned DESC, sort_order ASC, created_at ASC').all<LinkRow>()
  return results.map(mapLink)
}

export async function getSettings(env: Env) {
  const row = await env.DB.prepare('SELECT * FROM settings WHERE id = 1').first<SettingsRow>()
  if (!row) {
    throw new Error('settings missing')
  }
  return mapSettings(row)
}

export async function getBootstrap(env: Env) {
  const [groups, links, settings] = await Promise.all([listGroups(env), listLinks(env), getSettings(env)])
  return { groups, links, settings }
}
