const ICON_CACHE_VERSION = '3'

export function getFaviconUrl(url: string) {
  try {
    const normalized = new URL(url)
    return `/api/icon?url=${encodeURIComponent(normalized.toString())}&v=${ICON_CACHE_VERSION}`
  } catch {
    return null
  }
}

export function getNamedIconUrl(name: string) {
  const normalized = name.trim()
  if (!normalized) return null
  return `/api/icon?name=${encodeURIComponent(normalized)}`
}
