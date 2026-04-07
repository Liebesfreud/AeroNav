import type { Env } from './db/schema'
import { ApiError, ensureSettings, jsonError, requireUser, unauthorizedHtml, getAccessUser } from './auth/access'
import { bootstrap } from './routes/bootstrap'
import { createGroup, deleteGroup, updateGroup } from './routes/groups'
import { createLink, deleteLink, updateLink } from './routes/links'
import { exportData, importData } from './routes/importExport'
import { health } from './routes/health'
import { reorderEntities } from './routes/reorder'
import { updateUser } from './routes/user'
import { getWeather } from './routes/weather'

function notFound() {
  throw new ApiError(404, 'NOT_FOUND', 'Route not found')
}

function getIdFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  return segments.at(-1) ?? ''
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      await ensureSettings(env)
      const url = new URL(request.url)

      if (url.pathname === '/api/health' && request.method === 'GET') {
        return await health(env)
      }

      if (url.pathname.startsWith('/api/')) {
        const user = requireUser(request)

        if (url.pathname === '/api/bootstrap' && request.method === 'GET') {
          return await bootstrap(env, user)
        }
        if (url.pathname === '/api/user' && request.method === 'PATCH') {
          return await updateUser(request, env, user)
        }
        if (url.pathname === '/api/groups' && request.method === 'POST') {
          return await createGroup(request, env)
        }
        if (url.pathname.startsWith('/api/groups/') && request.method === 'PATCH') {
          return await updateGroup(request, env, getIdFromPath(url.pathname))
        }
        if (url.pathname.startsWith('/api/groups/') && request.method === 'DELETE') {
          return await deleteGroup(env, user, getIdFromPath(url.pathname))
        }
        if (url.pathname === '/api/links' && request.method === 'POST') {
          return await createLink(request, env)
        }
        if (url.pathname.startsWith('/api/links/') && request.method === 'PATCH') {
          return await updateLink(request, env, getIdFromPath(url.pathname))
        }
        if (url.pathname.startsWith('/api/links/') && request.method === 'DELETE') {
          return await deleteLink(env, user, getIdFromPath(url.pathname))
        }
        if (url.pathname === '/api/reorder' && request.method === 'POST') {
          return await reorderEntities(request, env, user)
        }
        if (url.pathname === '/api/export' && request.method === 'GET') {
          return await exportData(env, user)
        }
        if (url.pathname === '/api/import' && request.method === 'POST') {
          return await importData(request, env, user)
        }
        if (url.pathname === '/api/weather' && request.method === 'GET') {
          return await getWeather(request)
        }

        notFound()
      }

      if (!getAccessUser(request)) {
        return new Response(unauthorizedHtml(env.APP_NAME), {
          status: 401,
          headers: { 'content-type': 'text/html; charset=UTF-8' },
        })
      }

      return await env.ASSETS.fetch(request)
    } catch (error) {
      if (error instanceof ApiError) {
        return jsonError(error)
      }
      return jsonError(new ApiError(500, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'))
    }
  },
}
