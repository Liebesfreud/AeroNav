import { z } from 'zod'
import type { Env, User } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { getBootstrap } from '../db/repo'

const reorderSchema = z.object({
  groups: z.array(z.object({ id: z.string(), sortOrder: z.number().int().nonnegative() })),
  links: z.array(z.object({ id: z.string(), groupId: z.string(), sortOrder: z.number().int().nonnegative() })),
})

export async function reorderEntities(request: Request, env: Env, user: User) {
  const parsed = reorderSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_REORDER', 'Invalid reorder payload', parsed.error.flatten())

  const statements: D1PreparedStatement[] = []
  for (const group of parsed.data.groups) {
    statements.push(env.DB.prepare('UPDATE groups SET sort_order = ?, updated_at = ? WHERE id = ?').bind(group.sortOrder, new Date().toISOString(), group.id))
  }
  for (const link of parsed.data.links) {
    statements.push(env.DB.prepare('UPDATE links SET group_id = ?, sort_order = ?, updated_at = ? WHERE id = ?').bind(link.groupId, link.sortOrder, new Date().toISOString(), link.id))
  }
  if (statements.length) {
    await env.DB.batch(statements)
  }

  return jsonSuccess(await getBootstrap(env, user))
}
