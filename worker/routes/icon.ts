import tablerNodes from '../../node_modules/@tabler/icons/tabler-nodes-outline.json'
import { ApiError } from '../auth/access'

const CACHE_CONTROL = 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'

type TablerNode = [string, Record<string, string>]
const tablerNodeMap = tablerNodes as unknown as Record<string, TablerNode[]>

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function normalizeIconName(name: string) {
  return name
    .trim()
    .replace(/^icon(?=[A-Z0-9])/, '')
    .replace(/^icon[-_\s]+/i, '')
    .replace(/_/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function renderSvg(name: string) {
  const normalized = normalizeIconName(name)
  const nodes = tablerNodeMap[normalized]

  if (!nodes) {
    throw new ApiError(404, 'ICON_NOT_FOUND', '未找到可用图标。')
  }

  const body = nodes.map(([tagName, attributes]) => {
    const attrs = Object.entries(attributes)
      .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
      .join(' ')
    return `<${tagName}${attrs ? ` ${attrs}` : ''} />`
  }).join('')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    body,
    '</svg>',
  ].join('')
}

async function getFaviconResponse(requestUrl: URL, rawUrl: string) {
  let sourceUrl: URL

  try {
    sourceUrl = new URL(rawUrl)
  } catch {
    throw new ApiError(400, 'ICON_URL_INVALID', '图标地址无效。')
  }

  if (sourceUrl.protocol !== 'http:' && sourceUrl.protocol !== 'https:') {
    throw new ApiError(400, 'ICON_URL_INVALID', '仅支持 http 或 https 图标地址。')
  }

  const targetUrl = new URL('/favicon.ico', sourceUrl.origin)
  const cacheKey = new Request(requestUrl.toString(), { method: 'GET' })
  const cache = caches.default
  const cached = await cache.match(cacheKey)

  if (cached) return cached

  let upstream: Response

  try {
    upstream = await fetch(targetUrl.toString(), {
      cf: {
        cacheEverything: true,
        cacheTtl: 60 * 60 * 24 * 7,
      },
    })
  } catch {
    throw new ApiError(502, 'ICON_FETCH_FAILED', '图标拉取失败，请稍后重试。')
  }

  if (!upstream.ok) {
    throw new ApiError(404, 'ICON_NOT_FOUND', '未找到可用图标。')
  }

  const headers = new Headers(upstream.headers)
  headers.set('Cache-Control', CACHE_CONTROL)
  headers.set('Content-Type', headers.get('Content-Type') ?? 'image/x-icon')
  headers.delete('set-cookie')

  const response = new Response(upstream.body, {
    status: upstream.status,
    headers,
  })

  await cache.put(cacheKey, response.clone())
  return response
}

export async function getIcon(request: Request) {
  const url = new URL(request.url)
  const rawName = url.searchParams.get('name')
  const rawUrl = url.searchParams.get('url')

  if (rawName) {
    return new Response(renderSvg(rawName), {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': CACHE_CONTROL,
      },
    })
  }

  if (rawUrl) {
    return getFaviconResponse(url, rawUrl)
  }

  throw new ApiError(400, 'ICON_SOURCE_REQUIRED', '缺少图标来源参数。')
}
