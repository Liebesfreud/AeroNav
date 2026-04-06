import { z } from 'zod'
import type { Env, LinkRow } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { createId, getBootstrap, listLinks, mapLink, nowIso } from '../db/repo'

const createLinkSchema = z.object({
  groupId: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  url: z.string().url(),
  icon: z.string().trim().max(32).nullable().optional(),
  description: z.string().trim().max(280).nullable().optional(),
  tileSize: z.enum(['1x1', '1x2']).optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
})

const patchLinkSchema = z.object({
  groupId: z.string().min(1).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  url: z.string().url().optional(),
  icon: z.string().trim().max(32).nullable().optional(),
  description: z.string().trim().max(280).nullable().optional(),
  tileSize: z.enum(['1x1', '1x2']).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
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
    description: parsed.data.description ?? null,
    tile_size: parsed.data.tileSize ?? '1x2',
    sort_order: count?.count ?? 0,
    pinned: parsed.data.pinned ? 1 : 0,
    archived: parsed.data.archived ? 1 : 0,
    created_at: now,
    updated_at: now,
  }

  await env.DB.prepare('INSERT INTO links (id, group_id, title, url, icon, description, tile_size, sort_order, pinned, archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(row.id, row.group_id, row.title, row.url, row.icon, row.description, row.tile_size, row.sort_order, row.pinned, row.archived, row.created_at, row.updated_at)
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
    description: parsed.data.description === undefined ? existing.description : parsed.data.description,
    tile_size: parsed.data.tileSize ?? existing.tile_size,
    sort_order: parsed.data.sortOrder ?? existing.sort_order,
    pinned: parsed.data.pinned === undefined ? existing.pinned : parsed.data.pinned ? 1 : 0,
    archived: parsed.data.archived === undefined ? existing.archived : parsed.data.archived ? 1 : 0,
    updated_at: nowIso(),
  }

  await env.DB.prepare('UPDATE links SET group_id = ?, title = ?, url = ?, icon = ?, description = ?, tile_size = ?, sort_order = ?, pinned = ?, archived = ?, updated_at = ? WHERE id = ?')
    .bind(updated.group_id, updated.title, updated.url, updated.icon, updated.description, updated.tile_size, updated.sort_order, updated.pinned, updated.archived, updated.updated_at, id)
    .run()

  return jsonSuccess({ link: mapLink(updated), links: await listLinks(env) })
}

export async function deleteLink(env: Env, id: string) {
  const existing = await env.DB.prepare('SELECT id FROM links WHERE id = ?').bind(id).first<{ id: string }>()
  if (!existing) throw new ApiError(404, 'LINK_NOT_FOUND', 'Link not found')

  await env.DB.prepare('DELETE FROM links WHERE id = ?').bind(id).run()
  return jsonSuccess(await getBootstrap(env))
}
