import type { ReactNode } from 'react'

export function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 ${className}`}>{children}</div>
}
