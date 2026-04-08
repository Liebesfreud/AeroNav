import { ApiError } from '../auth/access'

const CACHE_CONTROL = 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'

export async function getIcon(request: Request) {
  const url = new URL(request.url)
  const rawUrl = url.searchParams.get('url')

  if (!rawUrl) {
    throw new ApiError(400, 'ICON_URL_REQUIRED', '缺少图标地址参数。')
  }

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
  const cacheKey = new Request(url.toString(), { method: 'GET' })
  const cache = caches.default
  const cached = await cache.match(cacheKey)

  if (cached) {
    return cached
  }

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
