import type { ReactNode } from 'react'

export function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 ${className}`}>{children}</div>
}
