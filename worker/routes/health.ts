import type { Env } from '../db/schema'
import { jsonSuccess } from '../auth/access'

export async function health(env: Env) {
  const row = await env.DB.prepare('SELECT 1 as ok').first<{ ok: number }>()
  return jsonSuccess({ status: 'ok', database: row?.ok === 1 ? 'reachable' : 'unknown', timestamp: new Date().toISOString() })
}
