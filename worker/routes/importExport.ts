import { z } from 'zod'
import type { Env } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { getBootstrap, nowIso } from '../db/repo'

const settingsOnlySchema = z.object({
  settingsOnly: z.literal(true),
  settings: z.object({
    themeMode: z.enum(['light', 'dark', 'system']).optional(),
    cardDensity: z.enum(['compact', 'comfortable']).optional(),
    openInNewTab: z.boolean().optional(),
    showGroupIcons: z.boolean().optional(),
  }),
})

const importSchema = z.object({
  version: z.string().optional(),
  groups: z.array(z.object({ id: z.string(), name: z.string().min(1), icon: z.string().nullable().optional(), sortOrder: z.number().int().nonnegative() })),
  links: z.array(z.object({ id: z.string(), groupId: z.string(), title: z.string().min(1), url: z.string().url(), icon: z.string().nullable().optional(), description: z.string().nullable().optional(), sortOrder: z.number().int().nonnegative(), pinned: z.boolean(), archived: z.boolean() })),
  settings: z.object({
    themeMode: z.enum(['light', 'dark', 'system']),
    cardDensity: z.enum(['compact', 'comfortable']),
    openInNewTab: z.boolean(),
    showGroupIcons: z.boolean(),
  }),
})

export async function exportData(env: Env) {
  const data = await getBootstrap(env)
  return jsonSuccess({ version: '1', exportedAt: nowIso(), ...data })
}

export async function importData(request: Request, env: Env) {
  const body = await request.json()
  const settingsOnly = settingsOnlySchema.safeParse(body)

  if (settingsOnly.success) {
    const current = (await getBootstrap(env)).settings
    const next = { ...current, ...settingsOnly.data.settings, updatedAt: nowIso() }
    await env.DB.prepare('UPDATE settings SET theme_mode = ?, card_density = ?, open_in_new_tab = ?, show_group_icons = ?, updated_at = ? WHERE id = 1')
      .bind(next.themeMode, next.cardDensity, next.openInNewTab ? 1 : 0, next.showGroupIcons ? 1 : 0, next.updatedAt)
      .run()
    return jsonSuccess({ settings: next })
  }

  const parsed = importSchema.safeParse(body)
  if (!parsed.success) throw new ApiError(400, 'INVALID_IMPORT', 'Invalid import payload', parsed.error.flatten())

  const groupIds = new Set(parsed.data.groups.map((item) => item.id))
  for (const link of parsed.data.links) {
    if (!groupIds.has(link.groupId)) {
      throw new ApiError(400, 'INVALID_IMPORT', 'Link references a missing group', { linkId: link.id, groupId: link.groupId })
    }
  }

  const statements: D1PreparedStatement[] = [
    env.DB.prepare('DELETE FROM links'),
    env.DB.prepare('DELETE FROM groups'),
  ]

  for (const group of parsed.data.groups) {
    statements.push(
      env.DB.prepare('INSERT INTO groups (id, name, icon, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(group.id, group.name, group.icon ?? null, group.sortOrder, nowIso(), nowIso()),
    )
  }

  for (const link of parsed.data.links) {
    statements.push(
      env.DB.prepare('INSERT INTO links (id, group_id, title, url, icon, description, sort_order, pinned, archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(link.id, link.groupId, link.title, link.url, link.icon ?? null, link.description ?? null, link.sortOrder, link.pinned ? 1 : 0, link.archived ? 1 : 0, nowIso(), nowIso()),
    )
  }

  statements.push(
    env.DB.prepare('UPDATE settings SET theme_mode = ?, card_density = ?, open_in_new_tab = ?, show_group_icons = ?, updated_at = ? WHERE id = 1')
      .bind(parsed.data.settings.themeMode, parsed.data.settings.cardDensity, parsed.data.settings.openInNewTab ? 1 : 0, parsed.data.settings.showGroupIcons ? 1 : 0, nowIso()),
  )

  await env.DB.batch(statements)
  return jsonSuccess(await getBootstrap(env))
}
