import { z } from 'zod'
import type { Env, WebPanelRow } from '../db/schema'
import { ApiError, jsonSuccess } from '../auth/access'
import { createId, listWebPanels, getWebPanel, createWebPanel, updateWebPanel, deleteWebPanel, reorderWebPanels, nowIso, mapWebPanel } from '../db/repo'

const createPanelSchema = z.object({
  title: z.string().trim().min(1).max(80),
  url: z.string().url().refine((val) => val.startsWith('http://') || val.startsWith('https://'), { message: 'URL must start with http:// or https://' }),
  icon: z.string().trim().max(80).nullable().optional(),
  description: z.string().trim().max(200).nullable().optional(),
  openMode: z.enum(['iframe', 'external']).optional(),
  enabled: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
})

const patchPanelSchema = z.object({
  title: z.string().trim().min(1).max(80).optional(),
  url: z.string().url().refine((val) => val.startsWith('http://') || val.startsWith('https://'), { message: 'URL must start with http:// or https://' }).optional(),
  icon: z.string().trim().max(80).nullable().optional(),
  description: z.string().trim().max(200).nullable().optional(),
  openMode: z.enum(['iframe', 'external']).optional(),
  enabled: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
})

const reorderPanelSchema = z.object({
  panels: z.array(z.object({ id: z.string(), sortOrder: z.number().int().nonnegative() })),
})

export async function listPanels(env: Env) {
  return jsonSuccess({ panels: await listWebPanels(env) })
}

export async function createPanel(request: Request, env: Env) {
  const parsed = createPanelSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_PANEL', 'Invalid panel payload', parsed.error.flatten())

  const now = nowIso()
  const current = await listWebPanels(env)
  const row: WebPanelRow = {
    id: createId('pnl'),
    title: parsed.data.title,
    url: parsed.data.url,
    icon: parsed.data.icon ?? null,
    description: parsed.data.description ?? null,
    open_mode: parsed.data.openMode ?? 'iframe',
    enabled: parsed.data.enabled !== undefined ? (parsed.data.enabled ? 1 : 0) : 1,
    sort_order: parsed.data.sortOrder ?? current.length,
    created_at: now,
    updated_at: now,
  }

  await createWebPanel(env, row)
  return jsonSuccess({ panel: mapWebPanel(row), panels: await listWebPanels(env) })
}

export async function patchPanel(request: Request, env: Env, id: string) {
  const parsed = patchPanelSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_PANEL', 'Invalid panel payload', parsed.error.flatten())

  const existing = await getWebPanel(env, id)
  if (!existing) throw new ApiError(404, 'PANEL_NOT_FOUND', 'Panel not found')

  const updated = await updateWebPanel(env, id, {
    title: parsed.data.title ?? existing.title,
    url: parsed.data.url ?? existing.url,
    icon: parsed.data.icon === undefined ? existing.icon : parsed.data.icon,
    description: parsed.data.description === undefined ? existing.description : parsed.data.description,
    open_mode: parsed.data.openMode ?? existing.open_mode,
    enabled: parsed.data.enabled === undefined ? existing.enabled : (parsed.data.enabled ? 1 : 0),
    sort_order: parsed.data.sortOrder ?? existing.sort_order,
  })

  return jsonSuccess({ panel: mapWebPanel(updated!), panels: await listWebPanels(env) })
}

export async function removePanel(env: Env, id: string) {
  const existing = await getWebPanel(env, id)
  if (!existing) throw new ApiError(404, 'PANEL_NOT_FOUND', 'Panel not found')

  await deleteWebPanel(env, id)
  return jsonSuccess({ panels: await listWebPanels(env) })
}

export async function reorderPanels(request: Request, env: Env) {
  const parsed = reorderPanelSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, 'INVALID_REORDER', 'Invalid reorder payload', parsed.error.flatten())

  await reorderWebPanels(env, parsed.data.panels)
  return jsonSuccess({ panels: await listWebPanels(env) })
}
