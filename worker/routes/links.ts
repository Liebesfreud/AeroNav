import { z } from 'zod'
import type { Env, LinkRow, User } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { createId, getBootstrap, listLinks, mapLink, nowIso } from '../db/repo'

const createLinkSchema = z.object({
  groupId: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  url: z.string().url(),
  icon: z.string().trim().max(32).nullable().optional(),
  iconMode: z.enum(['favicon', 'material', 'image', 'text']).optional(),
  iconImageUrl: z.union([z.string().url(), z.literal('')]).transform((value) => value || null).nullable().optional(),
  iconText: z.string().trim().max(2).nullable().optional(),
  description: z.string().trim().max(280).nullable().optional(),
  tileSize: z.enum(['1x1', '1x3']).optional(),
  openMode: z.enum(['global', 'same-tab', 'new-tab']).optional(),
  backgroundColor: z.string().trim().regex(/^#(?:[0-9a-fA-F]{6})$/).nullable().optional(),
})

const patchLinkSchema = z.object({
  groupId: z.string().min(1).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  url: z.string().url().optional(),
  icon: z.string().trim().max(32).nullable().optional(),
  iconMode: z.enum(['favicon', 'material', 'image', 'text']).optional(),
  iconImageUrl: z.union([z.string().url(), z.literal('')]).transform((value) => value || null).nullable().optional(),
  iconText: z.string().trim().max(2).nullable().optional(),
  description: z.string().trim().max(280).nullable().optional(),
  tileSize: z.enum(['1x1', '1x3']).optional(),
  openMode: z.enum(['global', 'same-tab', 'new-tab']).optional(),
  backgroundColor: z.string().trim().regex(/^#(?:[0-9a-fA-F]{6})$/).nullable().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
})

export async function createLink(request: Request, env: Env) {
  const parsed = createLinkSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_LINK', 'Invalid link payload', parsed.error.flatten())

  const group = await env.DB.prepare('SELECT id FROM groups WHERE id = ?').bind(parsed.data.groupId).first<{ id: string }>()
  if (!group) throw new ApiError(404, 'GROUP_NOT_FOUND', 'Group not found')

  const count = await env.DB.prepare('SELECT COUNT(*) as count FROM links WHERE group_id = ?').bind(parsed.data.groupId).first<{ count: number }>()
  const now = nowIso()
  const row: LinkRow = {
    id: createId('lnk'),
    group_id: parsed.data.groupId,
    title: parsed.data.title,
    url: parsed.data.url,
    icon: parsed.data.icon ?? null,
    icon_mode: parsed.data.iconMode ?? 'favicon',
    icon_image_url: parsed.data.iconImageUrl ?? null,
    icon_text: parsed.data.iconText ?? null,
    description: parsed.data.description ?? null,
    tile_size: parsed.data.tileSize ?? '1x3',
    open_mode: parsed.data.openMode ?? 'global',
    background_color: parsed.data.backgroundColor ?? null,
    sort_order: count?.count ?? 0,
    created_at: now,
    updated_at: now,
  }

  await env.DB.prepare('INSERT INTO links (id, group_id, title, url, icon, icon_mode, icon_image_url, icon_text, description, tile_size, open_mode, background_color, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(row.id, row.group_id, row.title, row.url, row.icon, row.icon_mode, row.icon_image_url, row.icon_text, row.description, row.tile_size, row.open_mode, row.background_color, row.sort_order, row.created_at, row.updated_at)
    .run()

  return jsonSuccess({ link: mapLink(row), links: await listLinks(env) })
}

export async function updateLink(request: Request, env: Env, id: string) {
  const parsed = patchLinkSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_LINK', 'Invalid link payload', parsed.error.flatten())

  const existing = await env.DB.prepare('SELECT * FROM links WHERE id = ?').bind(id).first<LinkRow>()
  if (!existing) throw new ApiError(404, 'LINK_NOT_FOUND', 'Link not found')

  if (parsed.data.groupId) {
    const group = await env.DB.prepare('SELECT id FROM groups WHERE id = ?').bind(parsed.data.groupId).first<{ id: string }>()
    if (!group) throw new ApiError(404, 'GROUP_NOT_FOUND', 'Group not found')
  }

  const updated = {
    ...existing,
    group_id: parsed.data.groupId ?? existing.group_id,
    title: parsed.data.title ?? existing.title,
    url: parsed.data.url ?? existing.url,
    icon: parsed.data.icon === undefined ? existing.icon : parsed.data.icon,
    icon_mode: parsed.data.iconMode ?? existing.icon_mode,
    icon_image_url: parsed.data.iconImageUrl === undefined ? existing.icon_image_url : parsed.data.iconImageUrl,
    icon_text: parsed.data.iconText === undefined ? existing.icon_text : parsed.data.iconText,
    description: parsed.data.description === undefined ? existing.description : parsed.data.description,
    tile_size: parsed.data.tileSize ?? existing.tile_size,
    open_mode: parsed.data.openMode ?? existing.open_mode,
    background_color: parsed.data.backgroundColor === undefined ? existing.background_color : parsed.data.backgroundColor,
    sort_order: parsed.data.sortOrder ?? existing.sort_order,
    updated_at: nowIso(),
  }

  await env.DB.prepare('UPDATE links SET group_id = ?, title = ?, url = ?, icon = ?, icon_mode = ?, icon_image_url = ?, icon_text = ?, description = ?, tile_size = ?, open_mode = ?, background_color = ?, sort_order = ?, updated_at = ? WHERE id = ?')
    .bind(updated.group_id, updated.title, updated.url, updated.icon, updated.icon_mode, updated.icon_image_url, updated.icon_text, updated.description, updated.tile_size, updated.open_mode, updated.background_color, updated.sort_order, updated.updated_at, id)
    .run()

  return jsonSuccess({ link: mapLink(updated), links: await listLinks(env) })
}

export async function deleteLink(env: Env, user: User, id: string) {
  const existing = await env.DB.prepare('SELECT id FROM links WHERE id = ?').bind(id).first<{ id: string }>()
  if (!existing) throw new ApiError(404, 'LINK_NOT_FOUND', 'Link not found')

  await env.DB.prepare('DELETE FROM links WHERE id = ?').bind(id).run()
  return jsonSuccess(await getBootstrap(env, user))
}
