import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: ReactNode
}) {
  const styles = {
    primary:
      'border border-transparent bg-on-background text-white hover:bg-[#1f2422] dark:bg-dark-on-background dark:text-dark-background dark:hover:bg-[#dfe5df]',
    secondary:
      'border border-transparent bg-surface-container-low text-on-background hover:bg-surface-container dark:bg-dark-surface-container/80 dark:text-dark-on-background dark:hover:bg-dark-surface-container',
    ghost:
      'border border-transparent bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-background dark:text-dark-on-surface-variant dark:hover:bg-dark-surface-container/70 dark:hover:text-dark-on-background',
    danger:
      'border border-transparent bg-red-600 text-white hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400',
  }

  return (
    <button
      {...props}
      className={`inline-flex min-h-10 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
