import { z } from 'zod'
import type { Env, GroupRow, User } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { createId, getBootstrap, listGroups, mapGroup, nowIso } from '../db/repo'

const createGroupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  icon: z.string().trim().max(32).nullable().optional(),
})

const patchGroupSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  icon: z.string().trim().max(32).nullable().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
})

export async function createGroup(request: Request, env: Env) {
  const parsed = createGroupSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_GROUP', 'Invalid group payload', parsed.error.flatten())

  const now = nowIso()
  const current = await listGroups(env)
  const row: GroupRow = {
    id: createId('grp'),
    name: parsed.data.name,
    icon: parsed.data.icon ?? null,
    sort_order: current.length,
    created_at: now,
    updated_at: now,
  }

  await env.DB.prepare('INSERT INTO groups (id, name, icon, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(row.id, row.name, row.icon, row.sort_order, row.created_at, row.updated_at)
    .run()

  return jsonSuccess({ group: mapGroup(row), groups: await listGroups(env) })
}

export async function updateGroup(request: Request, env: Env, id: string) {
  const parsed = patchGroupSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_GROUP', 'Invalid group payload', parsed.error.flatten())

  const existing = await env.DB.prepare('SELECT * FROM groups WHERE id = ?').bind(id).first<GroupRow>()
  if (!existing) throw new ApiError(404, 'GROUP_NOT_FOUND', 'Group not found')

  const updated = {
    ...existing,
    name: parsed.data.name ?? existing.name,
    icon: parsed.data.icon === undefined ? existing.icon : parsed.data.icon,
    sort_order: parsed.data.sortOrder ?? existing.sort_order,
    updated_at: nowIso(),
  }

  await env.DB.prepare('UPDATE groups SET name = ?, icon = ?, sort_order = ?, updated_at = ? WHERE id = ?')
    .bind(updated.name, updated.icon, updated.sort_order, updated.updated_at, id)
    .run()

  return jsonSuccess({ group: mapGroup(updated), groups: await listGroups(env) })
}

export async function deleteGroup(env: Env, user: User, id: string) {
  const existing = await env.DB.prepare('SELECT id FROM groups WHERE id = ?').bind(id).first<{ id: string }>()
  if (!existing) throw new ApiError(404, 'GROUP_NOT_FOUND', 'Group not found')

  const linked = await env.DB.prepare('SELECT COUNT(*) as count FROM links WHERE group_id = ?').bind(id).first<{ count: number }>()
  if ((linked?.count ?? 0) > 0) throw new ApiError(409, 'GROUP_NOT_EMPTY', 'Please move or delete links in this group first')

  await env.DB.prepare('DELETE FROM groups WHERE id = ?').bind(id).run()
  return jsonSuccess(await getBootstrap(env, user))
}
