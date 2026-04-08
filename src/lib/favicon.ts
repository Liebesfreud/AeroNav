export function getFaviconUrl(url: string) {
  try {
    const normalized = new URL(url)
    return `/api/icon?url=${encodeURIComponent(normalized.toString())}`
  } catch {
    return null
  }
}
