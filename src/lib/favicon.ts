export function getFaviconUrl(url: string) {
  try {
    const normalized = new URL(url)
    return `/api/icon?url=${encodeURIComponent(normalized.toString())}`
  } catch {
    return null
  }
}

export function getNamedIconUrl(name: string) {
  const normalized = name.trim()
  if (!normalized) return null
  return `/api/icon?name=${encodeURIComponent(normalized)}`
}
