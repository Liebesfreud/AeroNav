import { useState } from 'react'
import { getNamedIconUrl } from '../lib/favicon'

export function NamedIcon({
  name,
  className,
  alt = '',
  decorative = true,
}: {
  name: string | null | undefined
  className?: string
  alt?: string
  decorative?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const src = name ? getNamedIconUrl(name) : null

  if (!src || failed) return null

  return (
    <img
      src={src}
      alt={decorative ? '' : alt}
      aria-hidden={decorative ? 'true' : undefined}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
